const fs = require('fs');
const { fieldPathExists } = require('./util');
const operations = require('./operations');

function parseSpec(file) {
    // Read file
    let rawdata = fs.readFileSync(file);

    // Parse file
    let rules = JSON.parse(rawdata);

    // Build rulesObj
    let rulesArr = [];
    rules.map( (rule) => {
        rulesArr.push(rule);
    } );

    return rulesArr;
}

function performOperations(obj, spec) {
    if(!spec || spec.length == 0) return obj;

    spec.map( (s) => {
        switch(s.type) {
            case 'validate':
                obj = JSON.parse(obj);
                console.log('validated');
                break;
            case 'raw':
                let tag = s.hasOwnProperty('tag')? s.tag : '';
                let [ newObj, fixed ] = operations[s.operation](obj, tag);
                obj = JSON.parse(newObj);
                if(fixed) Object.assign(obj, { tag: tag })
                break;
            case 'value':
                obj = JSON.parse(obj);
                if(s.hasOwnProperty('fields') && s.fields.length > 0) {
                    s.fields.map( (f) => {
                        let val = fieldPathExists(f, obj);
                        if(val.length > 0) {
                            val.map( (v) => {
                                if(operations.hasOwnProperty(s.operation)) {
                                    obj[f] = operations[s.operation](v, s.options);
                                }
                                else {
                                    process.stderr.write('\nERROR: undefined operation.\n');
                                    process.exit(1);
                                }
                            } );
                        }
                    } );
                }
                else {
                    process.stderr.write('\nERROR: no fields in spec.\n');
                    process.exit(1);
                }
                break;
            case 'transform':
                obj = JSON.parse(obj);
                if(s.hasOwnProperty('fields') && s.fields.length > 0) {
                    s.fields.map( (f) => {
                        if(operations.hasOwnProperty(s.operation)) {
                            obj = operations[s.operation](obj, f);
                        }
                        else {
                            process.stderr.write('\nERROR: undefined operation.\n');
                            process.exit(1);
                        }
                    } );
                }
                break;
        }
    } );

    return obj;
}

module.exports = { parseSpec, performOperations };
