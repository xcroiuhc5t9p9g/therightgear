const fs = require('fs');
let code = fs.readFileSync('src/pages/RegisterPage.tsx', 'utf8');

// Replace imports
code = code.replace(
  "import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';",
  "import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';"
);
code = code.replace(
  "import { userManagementStore, AppUser } from '../services/userManagementStore';",
  "// Removed fake user store"
);

// Replace handleSocialAuth
code = code.replace(
  /const handleSocialAuth = \(provider: 'Google' \| 'Apple'\) => \{[\s\S]*?setSubmitted\(true\);\n  \};/,
  `const handleSocialAuth = async (provider: 'Google' | 'Apple') => {
    if (provider !== 'Google') {
      alert("Apple sign in is not configured yet.");
      return;
    }
    if (hasFirebaseConfig) {
      try {
        const googleProvider = new GoogleAuthProvider();
        await signInWithPopup(firebaseAuth, googleProvider);
        onNavigate('explore');
      } catch (err: any) {
        console.error('Social auth error:', err);
        setRegError(err.message || 'Error signing in with Google.');
      }
    } else {
      setRegError('Firebase Auth is not configured.');
    }
  };`
);

// Replace handleProSubmit
code = code.replace(
  /const handleProSubmit = \(e: React\.FormEvent\) => \{[\s\S]*?triggerEmailConfirmation\(user\);\n  \};/,
  `const handleProSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!proForm.companyName || !proForm.workEmail || !proForm.vatNumber) {
      setRegError('Please complete all required company details.');
      return;
    }

    const strength = checkPasswordStrength(proForm.password);
    if (!strength.hasMinLen || !strength.hasUpper || !strength.hasLower || !strength.hasNumber) {
      setRegError('Company password does not meet minimum security requirements.');
      return;
    }

    if (proForm.password !== proForm.confirmPassword) {
      setRegError('The two passwords entered do not match.');
      return;
    }

    if (hasFirebaseConfig) {
      try {
        await createUserWithEmailAndPassword(firebaseAuth, proForm.workEmail, proForm.password);
        onNavigate('explore');
      } catch (err: any) {
        console.error('Registration error:', err);
        setRegError(err.message || 'Error creating account.');
      }
    } else {
      setRegError('Firebase Auth is not configured.');
    }
  };`
);

// Replace handleLoginSubmit
code = code.replace(
  /const handleLoginSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?setSubmitted\(true\);\n    \}\n  \};/,
  `const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both email and password.');
      return;
    }

    if (hasFirebaseConfig) {
      try {
        await signInWithEmailAndPassword(firebaseAuth, loginEmail, loginPassword);
        onNavigate('explore');
      } catch (err: any) {
        console.error('Login error:', err);
        setLoginError('Invalid email or password.');
      }
    } else {
      setLoginError('Firebase Auth is not configured.');
    }
  };`
);

fs.writeFileSync('src/pages/RegisterPage.tsx', code);
console.log('Patched RegisterPage.tsx');
