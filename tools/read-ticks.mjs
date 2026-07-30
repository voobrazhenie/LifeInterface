#!/usr/bin/env node
/* Read tick documents out of Firestore, for Claude Code.
 *
 * Uses a service-account key (Admin credentials) to mint an OAuth token and call
 * the Firestore REST API. No npm dependencies — just node's crypto.
 *
 * The key file bypasses every security rule, so it stays out of git (.gitignore)
 * and must never be pasted into the page or a public place.
 *
 * Setup:
 *   Firebase console -> Project settings -> Service accounts
 *   -> Generate new private key -> save as tools/service-account.json
 *
 * Usage:
 *   node tools/read-ticks.mjs --uid <UID>              # last 14 days
 *   node tools/read-ticks.mjs --uid <UID> --days 30
 *   node tools/read-ticks.mjs --uid <UID> --date 2026-07-30
 *   node tools/read-ticks.mjs --uid <UID> --json       # raw, for piping
 */

import { createSign } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const KEY_PATH = process.env.FIREBASE_SA_PATH || join(HERE, "service-account.json");
const SCOPE = "https://www.googleapis.com/auth/datastore";

function arg(name, fallback = null) {
  const i = process.argv.indexOf("--" + name);
  if (i === -1) return fallback;
  const v = process.argv[i + 1];
  return v && !v.startsWith("--") ? v : true;
}

const b64url = buf =>
  Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function accessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(JSON.stringify({
    iss: sa.client_email,
    scope: SCOPE,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  }));
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const jwt = `${header}.${claims}.${b64url(signer.sign(sa.private_key))}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt
    })
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`token exchange failed: ${body.error_description || JSON.stringify(body)}`);
  return body.access_token;
}

/* Firestore returns values wrapped by type; unwrap to plain JS. */
function decode(v) {
  if (v == null) return null;
  if ("booleanValue"   in v) return v.booleanValue;
  if ("stringValue"    in v) return v.stringValue;
  if ("integerValue"   in v) return Number(v.integerValue);
  if ("doubleValue"    in v) return v.doubleValue;
  if ("timestampValue" in v) return v.timestampValue;
  if ("nullValue"      in v) return null;
  if ("mapValue"       in v) return decodeFields(v.mapValue.fields || {});
  if ("arrayValue"     in v) return (v.arrayValue.values || []).map(decode);
  return v;
}
const decodeFields = f => Object.fromEntries(Object.entries(f).map(([k, v]) => [k, decode(v)]));

async function firestore(path, token, projectId, params = "") {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${path}${params}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 404) return null;
  const body = await res.json();
  if (!res.ok) throw new Error(`${res.status}: ${body.error?.message || JSON.stringify(body)}`);
  return body;
}

async function main() {
  const uid = arg("uid");
  if (!uid) {
    console.error("Need --uid. It's printed in the page's handoff block, or in\n" +
                  "Firebase console -> Authentication -> Users.");
    process.exit(2);
  }

  let sa;
  try {
    sa = JSON.parse(await readFile(KEY_PATH, "utf8"));
  } catch {
    console.error(`No service-account key at ${KEY_PATH}.\n` +
                  "Firebase console -> Project settings -> Service accounts -> Generate new private key.");
    process.exit(2);
  }

  const token = await accessToken(sa);
  const projectId = sa.project_id;
  const one = arg("date");

  let days = [];
  if (typeof one === "string") {
    const doc = await firestore(`users/${uid}/days/${one}`, token, projectId);
    if (doc) days = [{ date: one, ...decodeFields(doc.fields || {}) }];
  } else {
    const body = await firestore(`users/${uid}/days`, token, projectId, "?pageSize=300");
    days = (body?.documents || []).map(d => ({
      date: d.name.split("/").pop(),
      ...decodeFields(d.fields || {})
    }));
    const limit = Number(arg("days", 14));
    days.sort((a, b) => a.date.localeCompare(b.date));
    if (Number.isFinite(limit) && limit > 0) days = days.slice(-limit);
  }

  if (arg("json")) {
    console.log(JSON.stringify(days, null, 2));
    return;
  }

  if (!days.length) {
    console.log(`No tick documents found under users/${uid}/days.`);
    return;
  }
  for (const d of days) {
    const ticks = d.ticks || {};
    const on = Object.keys(ticks).filter(k => ticks[k]).sort();
    const offered = Array.isArray(d.items) ? d.items.length : null;
    const score = offered === null ? `${on.length} ticked` : `${on.length}/${offered}`;
    const session = d.sessionId
      ? `  ${d.sessionId}${d.sessionLabel ? ` ${d.sessionLabel}` : ""}${d.sessionDone ? " ✓" : " (not completed)"}`
      : d.sessionLabel ? `  ${d.sessionLabel}` : "";
    console.log(`${d.date}  ${score}${session}`);
    if (on.length) console.log("  did:     " + on.join(", "));
    if (offered) {
      const missed = d.items.filter(i => !ticks[i]);
      if (missed.length) console.log("  skipped: " + missed.join(", "));
    }
  }
}

main().catch(e => { console.error("Error:", e.message); process.exit(1); });
