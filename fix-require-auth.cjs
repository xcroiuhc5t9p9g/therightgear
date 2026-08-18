const fs = require('fs');
let code = fs.readFileSync('src/components/RequireAuth.tsx', 'utf8');

const replacement = `
export const RequireAuth: React.FC<RequireAuthProps> = ({ children, onNavigate, requiredCapability }) => {
  const { isAuthenticated, isLoading, hasEffectiveCapability, emailVerified } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      onNavigate('register');
    } else if (!isLoading && isAuthenticated && !emailVerified) {
      onNavigate('verify-email');
    }
  }, [isLoading, isAuthenticated, emailVerified, onNavigate]);

  if (isLoading) {
`;

code = code.replace(/export const RequireAuth: React\.FC<RequireAuthProps> = \(\{ children, onNavigate, requiredCapability \}\) => \{[\s\S]*?if \(isLoading\) \{/, replacement);

fs.writeFileSync('src/components/RequireAuth.tsx', code);
