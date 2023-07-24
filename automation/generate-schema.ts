import * as TJS from 'typescript-json-schema';
import * as path from 'path'
import * as fs from 'fs'
import _ from 'lodash';
import {deepMapObject} from '@freephoenix888/deep-map-object';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { program } from 'commander';
import {capitalCase} from 'case-anything'
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);


main()

async function main () {
  const cliOptions = await parseCliOptions();
  const settings: TJS.PartialArgs = {
    required: true,
    titles: true
  };
  
  // const compilerOptions: TJS.CompilerOptions = {
  //   strictNullChecks: false,
  //   skipLibCheck: true
  // };
 
  const program = TJS.getProgramFromFiles([cliOptions.interfaceFilePath]);
  
  let schema = TJS.generateSchema(program, cliOptions.interfaceName, settings); 
  if(!schema) {
    throw new Error("Failed to generate schema")
  }
  
  schema = await deepMapObject(schema, ({key, value}) => ({newKey: key, newValue: (key === 'title') ? capitalCase(value) : value}));
  if(cliOptions.outputJsonFilePath) {
    fs.writeFileSync(path.resolve(cliOptions.outputJsonFilePath), JSON.stringify(schema, null, 2));
  } else {
    console.log(JSON.stringify(schema, null, 2));
  }
}

async function parseCliOptions(): Promise<Options> {
  const cliOptions = yargs(hideBin(process.argv))
  .option('interface-file-path', {
    type: 'string',
    description: 'File path to the interface file',
    demandOption: true
  })
  .option('interface-name', {
    type: 'string',
    description: 'Interface name',
    demandOption: true
  })
  .option('output-json-file-path', {
    type: 'string',
    description: 'Output json file path',
    demandOption: false
  })
  .argv;
 
   return cliOptions;
 }

 interface Options {
    interfaceFilePath: string,
    interfaceName: string,
    outputJsonFilePath?: string | undefined;
 }


