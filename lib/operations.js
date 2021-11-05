const { fieldPathExists } = require('./util');

function convertDates(date, options) {
    let dateArr = {};

    switch(options.from) {
        case 'dd/mm/yyyy':
            let dateParts = date.split('/');
            dateArr['dd'] = dateParts[0];
            dateArr['mm'] = dateParts[1];
            dateArr['yyyy'] = dateParts[2];
            break;
    }

    switch(options.to) {
        case 'yyyy-mm-dd':
            return dateArr['yyyy'] + '-' + dateArr['mm'] + '-' + dateArr['dd'];
    }
}

function deleteField(obj, f) {
    let val = fieldPathExists(f, obj);
    if(val) {
        delete obj[f];
    }
    return obj;
}

function fixQuotes(string) {
    let matches = string.match(/":".*?"(,|})/g);
    let fixed = false;
    matches.map( m => {
        let x = m.substring(3, m.length - 2);
        if(x.match(/"/g)) {
            fixed = true;
            y = x.replace(/"/g, '\\"');
            string = string.replace(x, y);
        }
    } );

    return [ string, fixed ];
}

module.exports = { convertDates, deleteField, fixQuotes }
