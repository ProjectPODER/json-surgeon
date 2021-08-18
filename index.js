#!/usr/bin/env node
const JSONStream = require('JSONStream');
const es = require('event-stream');
const commandLineArgs = require('command-line-args');
const { parseSpec, performOperations } = require('./lib/spec');

const optionDefinitions = [
    { name: 'spec', alias: 's', type: String }
];
const args = commandLineArgs(optionDefinitions);

let spec = null;
if(args.spec) {
    // Read spec file to apply transformations
    spec = parseSpec(args.spec);
}

process.stdin.setEncoding('utf8');

process.stdin
.pipe(es.mapSync(function (obj) {
    let fixed = performOperations(obj, spec);
    return fixed;
}))
.pipe(JSONStream.stringify(false))
.pipe(process.stdout);

process.stdin.on('end', () => {
  process.stdout.write('\n');
});
