const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Add Corporate Profile handling
if (!app.includes("page === 'profile/organization'")) {
  app = app.replace(
    /\} else if \(page === 'profile'\) \{/,
    `} else if (page === 'profile') {
      newPath = '/profile';
    } else if (page === 'profile/organization') {
      newPath = '/profile/organization';`
  );
  
  app = app.replace(
    /\{currentPage === 'profile' && isAuthenticated && \(/,
    `{(currentPage === 'profile' || currentPage === 'profile/organization') && isAuthenticated && (`
  );
  
  app = app.replace(
    /currentPage=\'profile\'/,
    `currentPage={currentPage === 'profile/organization' ? 'profile' : currentPage}`
  );
  fs.writeFileSync('src/App.tsx', app);
}
