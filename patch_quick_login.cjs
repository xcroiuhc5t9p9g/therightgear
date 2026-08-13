const fs = require('fs');

let content = fs.readFileSync('src/pages/RegisterPage.tsx', 'utf-8');

const oldQuick = `  const quickLoginAs = (email: string) => {
    const user = userManagementStore.loginUser(email);
    if (user) {
      setActiveRole(user.role);
      setRegisteredUserObj(user);
      setSubmitted(true);
    }
  };`;

const newQuick = `  const quickLoginAs = async (email: string) => {
    if (hasFirebaseConfig) {
      let pwd = 'PasswordSecure123!';
      if (email === 'riccardo.monaco@gmail.com') {
        pwd = 'Riccardo#2026Admin!';
      } else if (email === 'elena.rinaldi@automotive-intel.com') {
        pwd = 'EditorPassword123!';
      }
      try {
        await signInWithEmailAndPassword(firebaseAuth, email, pwd);
        onNavigate('explore');
      } catch (err) {
        setLoginError('Could not quick login via Firebase. Account may not exist.');
      }
    } else {
      setLoginError('Firebase Auth is not configured.');
    }
  };`;

content = content.replace(oldQuick, newQuick);

fs.writeFileSync('src/pages/RegisterPage.tsx', content);
