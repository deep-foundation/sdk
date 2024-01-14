import * as fs from 'fs';
import * as path from 'path';

// Use the `import.meta` object to get the current module's URL
const moduleUrl = new URL(import.meta.url);
const directoryName = path.dirname(moduleUrl.pathname);

// Load the root package.json
const rootPackageJsonPath = path.join(directoryName, '..', 'package.json');
const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf-8'));

// Update the Electron package.json
const electronPackageJsonPath = path.join(directoryName, '..', 'electron', 'package.json');
const electronPackageJson = JSON.parse(fs.readFileSync(electronPackageJsonPath, 'utf-8'));
electronPackageJson.version = rootPackageJson.version;

// Write the updated Electron package.json
fs.writeFileSync(electronPackageJsonPath, JSON.stringify(electronPackageJson, null, 2));

console.log(`Electron version synchronized with root version: ${rootPackageJson.version}`);
