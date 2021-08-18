# json-surgeon

Perform conversions of all sorts on a stream of JSON objects (valid or not).

## Usage

    (stream of JSON lines) | node json-surgeon/index.js -s SPEC | (stream of JSON lines, one object per line)

## Options

    --spec   -s  Path to a JSON file containing the specification for the operations to perform.

## Additional notes

Spec files are an array of JSON spec objects. Spec objects need to contain at least the following properties:

- operation: the function to perform on each line. Must be defined inside *lib/operations.js* and properly exported using *module.exports*.
- type: what type of operation will be performed. Supported types are:
    - value: for fixing the values of any number of fields. Example: *fixDates.json* (changes date format for specified fields).
    - transform: for altering the object's structure. Example: *deleteYears.json* (deletes a field named "years").
    - raw: for working with plain text before attempting to parse as JSON. Example: *fixQuotes.json* (detects and fixes unescaped quotes that prevent a string from being parsed correctly).

See each example for additional required fields. New types should be defined in *lib/spec.js* inside the **performOperations** function.
