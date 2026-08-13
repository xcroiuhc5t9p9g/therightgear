const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{ts,tsx}');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/'admin'/g, "'super_admin'");
  content = content.replace(/'data_manager'/g, "'editor'");
  content = content.replace(/'dealer'/g, "'corporate_user'");
  content = content.replace(/'corporate_premium'/g, "'corporate_user'");
  content = content.replace(/'registered_user'/g, "'private_user'");
  content = content.replace(/'premium_user'/g, "'private_user'");

  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
