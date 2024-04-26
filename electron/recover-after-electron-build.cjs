const fs = require('fs');
const shell = require('child_process').execSync;

const delimetr = process.platform === 'win32' ? '\\' : '/';
const typesPath = `node_modules${delimetr}@types`

const linuxAppPath = 'dist/linux-unpacked/resources/app';
const windowsAppPath = 'dist\\win-unpacked\\resources\\app';
const macAppPath = 'dist/mac/sdk.app/Contents/Resources/app';

const appPath = process.platform === 'win32' ? windowsAppPath : process.platform === 'darwin' ? macAppPath : linuxAppPath;

exports.default = async function(context) {
  if (process.platform === 'win32') {
    try {
      console.log('outDir', `${context.outDir}`, fs.readFileSync(`${context.outDir}`));
      console.log('appOutDir', `${context.appOutDir}`, fs.readFileSync(`${context.appOutDir}`));
      console.log('resources', `${context.appOutDir}\resources`, fs.readFileSync(`${context.appOutDir}\resources`));
      console.log('app', `${context.appOutDir}\resources\app`, fs.readFileSync(`${context.appOutDir}\resources\app`));
      console.log('build', `${context.appOutDir}\resources\app\build`, fs.readFileSync(`${context.appOutDir}\resources\app\build`));
      console.log('src', `${context.appOutDir}\resources\app\build\src`, fs.readFileSync(`${context.appOutDir}\resources\app\build\src`));
    } catch(e) {
      console.log('error', e);
    }
  }
  try {
    if (fs.existsSync(`${appPath}${delimetr}${typesPath}`))fs.rmSync(`${appPath}${delimetr}${typesPath}`, { recursive: true });
    shell(`cp -r ${typesPath} ${appPath}${delimetr}${typesPath}`);
  } catch(err) {
    console.error(err);
  }
}