// Parameters:
//      field: name of the field as a string separated by "."
//      tempObj: the object in which the fields should be found
// Return:
//      Array: the contents of the field, or empty array if the field was not found
function fieldPathExists(field, tempObj) {
    var fieldValues = [];
    var fieldPath = field.split('.');

    // Iterate over array with the components of the field
    for(var i=0; i<fieldPath.length; i++) {
        // Field does NOT exist in object
        if( typeof tempObj[fieldPath[i]] == 'undefined' ) {
            return fieldValues;
        }
        // Field has a value of null
        if(tempObj[fieldPath[i]] == null) {
            return fieldValues;
        }

        if( isArray(tempObj[fieldPath[i]]) ) { // Field is an array
            if(i == fieldPath.length - 1) { // Estamos chequeando si existe el array, no su valor
                fieldValues.push(tempObj[fieldPath[i]]);
            }
            else if( tempObj[fieldPath[i]].length > 0 ) { // Iteramos sobre el array de campos
                tempObj[fieldPath[i]].map( (tempItem) => {
                    var results = fieldPathExists( fieldPath.slice(i+1, fieldPath.length).join('.'), tempItem );
                    fieldValues = fieldValues.concat(results);
                } );
            }
            return fieldValues;
        }
        else if( isString(tempObj[fieldPath[i]]) || isNumeric(tempObj[fieldPath[i]]) ) { // Value of the field is a string or number
            if(i < fieldPath.length - 1) { // Arrived at a string or number while end of path has not been reached
                return fieldValues;
            }
            if(tempObj[fieldPath[i]] == '' || tempObj[fieldPath[i]] == '---' || tempObj[fieldPath[i]] == 'null') { // Arrived at empty string, '---' or 'null'
                return fieldValues;
            }
            fieldValues.push( tempObj[fieldPath[i]] );
            return fieldValues;
        }
        else if( isDate(tempObj[fieldPath[i]]) ) { // Value of the field is a date
            if(i < fieldPath.length - 1) { // Arrived at a date while end of path has not been reached
                return fieldValues;
            }
            fieldValues.push(tempObj[fieldPath[i]].toISOString());
            return fieldValues;
        }
        else if( tempObj.hasOwnProperty(fieldPath[i]) && !isEmpty(tempObj[fieldPath[i]]) ) { // fieldPath[i] is an object
            tempObj = tempObj[fieldPath[i]];
        }
        else { // None of the above...
            return fieldValues;
        }
    }

    fieldValues.push(tempObj);
    return fieldValues;
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function isObject(val) {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
}

function isArray(obj) {
    return !!obj && obj.constructor === Array;
}

function isString(x) {
    return Object.prototype.toString.call(x) === "[object String]"
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isDate(d) {
    return typeof d.toISOString === "function";
}

module.exports = { fieldPathExists }
