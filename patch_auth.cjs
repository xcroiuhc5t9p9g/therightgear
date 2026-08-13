const fs = require('fs');
let code = fs.readFileSync('src/context/AuthContext.tsx', 'utf8');

code = code.replace(
  /const hasEffectiveCapability = \(capability: Capability\): boolean => \{\n    return hasCapability\(actualRole, capability\);\n  \};/,
  `const hasEffectiveCapability = (capability: Capability): boolean => {
    const actualHasIt = hasCapability(actualRole, capability);
    if (previewRole) {
      const previewHasIt = hasCapability(previewRole, capability);
      return actualHasIt && previewHasIt;
    }
    return actualHasIt;
  };`
);

fs.writeFileSync('src/context/AuthContext.tsx', code);
console.log('Patched AuthContext');
