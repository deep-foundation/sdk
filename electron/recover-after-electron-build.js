const fs = require('fs');
const shell = require('child_process').execSync;

const delimetr = process.platform === 'win32' ? '\\' : '/';
const typesPath = `node_modules${delimetr}@types`

const linuxAppPath = 'dist/linux-unpacked/resources/app';
const windowsAppPath = 'dist\\win-unpacked\\resources\\app';
const macAppPath = 'dist/mac/SDK.app/Contents/Resources/app';

const appPath = process.platform === 'win32' ? windowsAppPath : process.platform === 'darwin' ? macAppPath : linuxAppPath;

exports.default = async function(context) {
  console.log(`${appPath}${delimetr}${typesPath}`);
  console.log(`cp -r ${typesPath} ${appPath}${delimetr}${typesPath}`);
  try {
    if (fs.existsSync(`${appPath}${delimetr}${typesPath}`))fs.rmSync(`${appPath}${delimetr}${typesPath}`, { recursive: true });
    shell(`cp -r ${typesPath} ${appPath}${delimetr}${typesPath}`);
  } catch(err) {
    console.error(err);
  }
}