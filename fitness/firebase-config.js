/* Firebase web config.
 *
 * This file is PUBLIC BY DESIGN and safe to commit. The apiKey is an identifier
 * saying which project to talk to — not a credential. What actually protects the
 * data is firestore.rules, which only lets a signed-in person touch documents
 * under their own uid.
 *
 * The thing that must NEVER be committed is a service-account key (the Admin SDK
 * credential). That one bypasses all rules. .gitignore blocks it.
 *
 * While this is null the page runs in local-only mode: ticks stay in this browser
 * and nothing syncs. Paste the config object from
 *   Firebase console → Project settings → Your apps → SDK setup and configuration
 * to switch syncing on.
 */
export const firebaseConfig = null;

/* Replace the line above with the real thing, e.g.:

export const firebaseConfig = {
  apiKey: "AIza…",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:abcdef"
};

*/
