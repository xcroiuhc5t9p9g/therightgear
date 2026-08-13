const fs = require('fs');
let code = fs.readFileSync('src/components/PublicShell.tsx', 'utf8');

code = code.replace(
  "import { AuthPromptModal } from './AuthPromptModal';",
  "import { AuthPromptModal } from './AuthPromptModal';\nimport { useAuth } from '../context/AuthContext';"
);

code = code.replace(
  "export const PublicShell: React.FC<PublicShellProps> = ({",
  "export const PublicShell: React.FC<PublicShellProps> = ({\n"
);

code = code.replace(
  "const handleSearch = (q: string) => {",
  `const { actualRole, previewRole, setPreviewRole } = useAuth();
  
  const handleSearch = (q: string) => {`
);

code = code.replace(
  '<Header',
  `{actualRole === 'super_admin' && previewRole && previewRole !== 'super_admin' && (
        <div className="bg-trg-red text-white px-4 py-2 text-xs font-bold flex justify-between items-center z-50">
          <span>VIEWING AS {previewRole.replace('_', ' ').toUpperCase()}</span>
          <button 
            onClick={() => setPreviewRole(null)}
            className="bg-black/20 hover:bg-black/40 px-3 py-1 rounded transition-colors"
          >
            Exit Preview
          </button>
        </div>
      )}
      <Header`
);

fs.writeFileSync('src/components/PublicShell.tsx', code);
console.log('Patched PublicShell with preview banner');
