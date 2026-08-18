const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;

function updateFile(filePath, regex, replacement) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  const newContent = content.replace(regex, replacement);
  
  if (content !== newContent) {
    fs.writeFileSync(fullPath, newContent, 'utf8');
    console.log(`✅ Updated ${filePath} to version ${version}`);
  } else {
    console.log(`ℹ️ ${filePath} is already up to date (${version})`);
  }
}

// Update README.md badge
// Example: [![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](src/constants.js)
updateFile(
  'README.md',
  /version-\d+\.\d+\.\d+-green\.svg/,
  `version-${version}-green.svg`
);

console.log('Sync complete.');
