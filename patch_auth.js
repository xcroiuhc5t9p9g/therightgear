const fs = require('fs');

let content = fs.readFileSync('src/pages/RegisterPage.tsx', 'utf-8');

// Add Firebase imports
content = content.replace(
  "import { UserRole } from '../types';",
  "import { UserRole } from '../types';\nimport { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';\nimport { firebaseAuth, hasFirebaseConfig } from '../services/firebase';"
);

// Replace handleLoginSubmit
const oldHandleLoginSubmit = `  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail) {
      setLoginError('Please enter a valid email address.');
      return;
    }

    if (!loginPassword && loginEmail.trim().toLowerCase() !== 'riccardo.monaco@gmail.com') {
      setLoginError('Please enter your password to sign in.');
      return;
    }

    const user = userManagementStore.loginUser(loginEmail, loginPassword);
    if (user) {
      setActiveRole(user.role);
      setRegisteredUserObj(user);
      setSubmitted(true);
    } else {
      const isRiccardo = loginEmail.trim().toLowerCase() === 'riccardo.monaco@gmail.com';
      const created = userManagementStore.registerUser({
        fullName: isRiccardo ? 'Riccardo Monaco' : 'User ' + loginEmail.split('@')[0],
        email: loginEmail,
        password: loginPassword || 'PasswordSecure123!',
        role: isRiccardo ? 'admin' : 'registered_user',
        companyOrTitle: isRiccardo ? 'Chief System Administrator' : 'Registered User'
      });
      setActiveRole(created.role);
      setRegisteredUserObj(created);
      setSubmitted(true);
    }
  };`;

const newHandleLoginSubmit = `  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both email and password.');
      return;
    }

    if (hasFirebaseConfig) {
      try {
        await signInWithEmailAndPassword(firebaseAuth, loginEmail, loginPassword);
        // AuthContext will handle state
        onNavigate('explore');
      } catch (err: any) {
        console.error('Login error:', err);
        setLoginError('Invalid email or password.');
      }
    } else {
      // Fallback
      setLoginError('Firebase Auth is not configured.');
    }
  };`;

content = content.replace(oldHandleLoginSubmit, newHandleLoginSubmit);

fs.writeFileSync('src/pages/RegisterPage.tsx', content);
