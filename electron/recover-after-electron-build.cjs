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
    try {console.log('outDir\\..', `${context.outDir}\\..`);} catch(e) { console.log(e); }
    try {console.log(fs.readdirSync(`${context.outDir}\\..`));} catch(e) { console.log(e); }
    try {console.log('outDir\\..\\build', `${context.outDir}\\..\\build`);} catch(e) { console.log(e); }
    try {console.log(fs.readdirSync(`${context.outDir}\\..\\build`));} catch(e) { console.log(e); }
    try {console.log('outDir\\..\\build\\src', `${context.outDir}\\..\\build\\src`);} catch(e) { console.log(e); }
    try {console.log(fs.readdirSync(`${context.outDir}\\..\\build\\src`));} catch(e) { console.log(e); }
    try {console.log('outDir', `${context.outDir}`);} catch(e) { console.log(e); }
    try {console.log(fs.readdirSync(`${context.outDir}`));} catch(e) { console.log(e); }
    try {console.log('appOutDir', `${context.appOutDir}`);} catch(e) { console.log(e); }
    try {console.log(fs.readdirSync(`${context.appOutDir}`));} catch(e) { console.log(e); }
    try {console.log('resources', `${context.appOutDir}\\resources`);} catch(e) { console.log(e); }
    try {console.log(fs.readdirSync(`${context.appOutDir}\\resources`));} catch(e) { console.log(e); }
    try {console.log('app', `${context.appOutDir}\\resources\\app`);} catch(e) { console.log(e); }
    try {console.log(fs.readdirSync(`${context.appOutDir}\\resources\\app`));} catch(e) { console.log(e); }
    try {console.log('build', `${context.appOutDir}\\resources\\app\\build`);} catch(e) { console.log(e); }
    try {console.log(fs.readdirSync(`${context.appOutDir}\\resources\\app\\build`));} catch(e) { console.log(e); }
    try {console.log('src', `${context.appOutDir}\\resources\\app\\build\\src`);} catch(e) { console.log(e); }
    try {console.log(fs.readdirSync(`${context.appOutDir}\\resources\\app\\build\\src`));} catch(e) { console.log(e); }
  }
  try {
    if (fs.existsSync(`${appPath}${delimetr}${typesPath}`))fs.rmSync(`${appPath}${delimetr}${typesPath}`, { recursive: true });
    shell(`cp -r ${typesPath} ${appPath}${delimetr}${typesPath}`);
  } catch(err) {
    console.error(err);
  }
}