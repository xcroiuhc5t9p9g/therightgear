const fs = require('fs');
let code = fs.readFileSync('src/pages/RegisterPage.tsx', 'utf8');

// For Google Sign-In
code = code.replace(
  /await signInWithPopup\(firebaseAuth, googleProvider\);\n\s*onNavigate\('verify-email'\);/,
  "await signInWithPopup(firebaseAuth, googleProvider);\n        onNavigate('explore');"
);

// For normal login
code = code.replace(
  /await signInWithEmailAndPassword\(firebaseAuth, loginEmail, loginPassword\);\n\s*\/\/ AuthContext will handle state\n\s*onNavigate\('verify-email'\);/,
  "await signInWithEmailAndPassword(firebaseAuth, loginEmail, loginPassword);\n        // AuthContext will handle state\n        onNavigate('explore');"
);

// For quick login
code = code.replace(
  /await signInWithEmailAndPassword\(firebaseAuth, email, pwd\);\n\s*onNavigate\('verify-email'\);/,
  "await signInWithEmailAndPassword(firebaseAuth, email, pwd);\n        onNavigate('explore');"
);

fs.writeFileSync('src/pages/RegisterPage.tsx', code);
