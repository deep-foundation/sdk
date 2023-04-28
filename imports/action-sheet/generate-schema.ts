import * as TJS from 'typescript-json-schema';
import * as path from 'path'
import * as fs from 'fs'
import _ from 'lodash';
import {deepMapObject} from '@freephoenix888/deep-map-object';

async function main () {
  const settings: TJS.PartialArgs = {
    required: true,
  };
  
  const compilerOptions: TJS.CompilerOptions = {
    strictNullChecks: true,
  };
  
  // Add the path to the library's TypeScript definition file, usually located in the node_modules folder
  const definitionFilePath = require.resolve('@capacitor/action-sheet/dist/esm/definitions.d.ts');
  
  const program = TJS.getProgramFromFiles([definitionFilePath], compilerOptions);
  
  // Replace 'LibraryInterface' with the actual interface name from the dependency library
  let schema = TJS.generateSchema(program, 'ShowActionsOptions', settings); 
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
  schema = await deepMapObject(schema, ({key, value}) => ({newKey: keyNamesNotToMap.includes(key) ? key : _.upperFirst(key), newValue: value}));
  fs.writeFileSync(path.resolve('imports/action-sheet/schema.json'), JSON.stringify(schema, null, 2));
}

main()


