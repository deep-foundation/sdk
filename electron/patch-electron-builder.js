const fs = require('fs');
const delimetr = process.platform === 'win32' ? '\\' : '/';
const badboy = `node_modules${delimetr}app-builder-lib${delimetr}out${delimetr}fileMatcher.js`;

try {
  console.log('patching electron-builder');
  let code = fs.readFileSync(badboy).toString();
  if (!code) throw new Error('file for patch not found');
  code = code.indexOf(',d.ts') ? code.replace(',d.ts', '') : code.replace('d.ts', '');
  fs.writeFileSync(badboy, code);
} catch(err) {
  console.error(err);
}