import * as TJS from 'typescript-json-schema';
import * as path from 'path'
import * as fs from 'fs'
import _ from 'lodash';
import {deepMapObject} from '@freephoenix888/deep-map-object';
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

main()

async function main () {
  const parsedArguments = await parseArguments();
  const settings: TJS.PartialArgs = {
    required: true,
    titles: true
  };
  
  const compilerOptions: TJS.CompilerOptions = {
    strictNullChecks: true,
  };
  
  const definitionFilePath = require.resolve(parsedArguments.interfaceFilePath);
  
  const program = TJS.getProgramFromFiles([definitionFilePath], compilerOptions);
  
  let schema = TJS.generateSchema(program, parsedArguments.interfaceName, settings); 
  if(!schema) {
    throw new Error("Failed to generate schema")
  }
  const keyNamesNotToMap = [
    'type',
    'properties',
    'description',
    'items',
    'required',
    'definitions',
    '$schema',
    'enum'
  ];
  // schema = await deepMapObject(schema, ({key, value}) => ({newKey: keyNamesNotToMap.includes(key) ? key : _.upperFirst(key), newValue: value}));
  schema = await deepMapObject(schema, ({key, value}) => ({newKey: key, newValue: (key === 'title') ? _.upperFirst(value) : value}));
  fs.writeFileSync(path.resolve(parsedArguments.outputJsonFilePath), JSON.stringify(schema, null, 2));
}

async function parseArguments(): Promise<{interfaceFilePath: string, interfaceName: string, outputJsonFilePath: string}> {
  return yargs(hideBin(process.argv))
  .option('interface-file-path', {
    type: 'string',
    description: 'File path to the interface file which will be passed to require.resolve. For example @capacitor/action-sheet/dist/esm/definitions.d.ts',
  })
  .option('interface-name', {
    type: 'string',
    description: 'Interface name',
  })
  .option('output-json-file-path', {
    type: 'string',
    description: 'Output json file path',
  })
  .help()
  .argv;
}


