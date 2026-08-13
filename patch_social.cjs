const fs = require('fs');
let content = fs.readFileSync('src/pages/RegisterPage.tsx', 'utf-8');

const oldSocial = `  const handleSocialAuth = (provider: 'Google' | 'Apple') => {
    // MOCK implementation
    const socialEmail = provider === 'Google' ? 'riccardo.monaco@gmail.com' : 'riccardo.monaco@icloud.com';
    const socialName = provider === 'Google' ? 'Riccardo Monaco (Google)' : 'Riccardo Monaco (Apple ID)';

    const user = userManagementStore.registerUser({
      fullName: socialName,
      email: socialEmail,
      password: 'SocialLoginToken123!',
      role: 'registered_user',
      companyOrTitle: 'Private Collector'
    });

    setRegisteredUserObj(user);
    setActiveRole(user.role);
    setSubmitted(true);
    triggerEmailConfirmation(user);
  };`;

const newSocial = `  const handleSocialAuth = async (provider: 'Google' | 'Apple') => {
    if (provider !== 'Google') {
      alert(provider + ' sign-in is not implemented yet.');
      return;
    }
    if (hasFirebaseConfig) {
      try {
        const { signInWithPopup } = await import('firebase/auth');
        const { googleAuthProvider } = await import('../services/firebase');
        await signInWithPopup(firebaseAuth, googleAuthProvider);
        onNavigate('explore');
      } catch (err: any) {
        console.error('Social login error:', err);
        setLoginError('Could not sign in with Google.');
        setRegError('Could not sign in with Google.');
      }
    } else {
      setLoginError('Firebase Auth is not configured.');
      setRegError('Firebase Auth is not configured.');
    }
  };`;

content = content.replace(oldSocial, newSocial);
fs.writeFileSync('src/pages/RegisterPage.tsx', content);
