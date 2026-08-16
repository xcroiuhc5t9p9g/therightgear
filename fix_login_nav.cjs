const fs = require('fs');
let code = fs.readFileSync('src/pages/RegisterPage.tsx', 'utf8');

// For regular login
code = code.replace(
  "await signInWithEmailAndPassword(firebaseAuth, loginEmail, loginPassword);\n        // AuthContext will handle state\n        onNavigate('explore');",
  "const userCred = await signInWithEmailAndPassword(firebaseAuth, loginEmail, loginPassword);\n        if (!userCred.user.emailVerified) {\n          onNavigate('verify-email');\n        } else {\n          onNavigate('explore');\n        }"
);

// For quick login
code = code.replace(
  "await signInWithEmailAndPassword(firebaseAuth, email, pwd);\n        onNavigate('explore');",
  "const userCred = await signInWithEmailAndPassword(firebaseAuth, email, pwd);\n        if (!userCred.user.emailVerified) {\n          onNavigate('verify-email');\n        } else {\n          onNavigate('explore');\n        }"
);

// For Google Sign-in
code = code.replace(
  "await signInWithPopup(firebaseAuth, googleProvider);\n        onNavigate('explore');",
  "const userCred = await signInWithPopup(firebaseAuth, googleProvider);\n        if (!userCred.user.emailVerified) {\n          onNavigate('verify-email');\n        } else {\n          onNavigate('explore');\n        }"
);

fs.writeFileSync('src/pages/RegisterPage.tsx', code);
