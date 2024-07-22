const fs = require('fs');
const path = require('path');
const nextPckg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const electronPckg = JSON.parse(fs.readFileSync(path.join(__dirname, 'electron', 'package.json'), 'utf8'));
electronPckg.version = nextPckg.version;
fs.writeFileSync(path.join(__dirname, 'electron', 'package.json'), JSON.stringify(electronPckg, null, 2));