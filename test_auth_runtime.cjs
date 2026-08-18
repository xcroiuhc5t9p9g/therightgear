const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const fs = require('fs');

async function test() {
  const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
  const app = initializeApp(config);
  const auth = getAuth(app);
  
  try {
    await signInWithEmailAndPassword(auth, "test@example.com", "wrongpass");
  } catch (e) {
    console.log("ERR: " + e.code);
  }
}
test();
