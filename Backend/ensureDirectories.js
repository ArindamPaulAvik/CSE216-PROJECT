const fs = require('fs');
const path = require('path');

// Directories to ensure exist
const directories = [
  'public/banners',
  'public/shows',
  'public/actors',
  'public/directors',
  'public/awards',
  'public/images/user'
];

function ensureDirectories() {
  directories.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`Created directory: ${fullPath}`);
    } else {
      console.log(`Directory already exists: ${fullPath}`);
    }
  });
}

module.exports = { ensureDirectories }; 