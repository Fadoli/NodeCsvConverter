let keysEntries, ObjectAsArray;
let keyArrays;

const writableBuffer = require('./WritableBuffer');

function _handleObject(prefix, object) {
    for (const key in object) {
        const value = object[key];
        const newKey = `${prefix}.${key}`;
        if (value?.constructor === Object) {
            if (Array.isArray(value)) {
                throw new Error("Sub arrays are not allowed !");
            }
            _handleObject(newKey, value);
        } else {
            let keyId = keysEntries.get(newKey);

            if (keyId === undefined) {
                keyId = keysEntries.size;
                keysEntries.set(newKey, keyId);
                keyArrays.push(newKey);
            }

            if (value.length) {
                ObjectAsArray[keyId] = `"${value}"`;
            } else {
                ObjectAsArray[keyId] = value;
            }
        }
    }
}
function handleObject(object) {
    ObjectAsArray = new Array(keysEntries.size);
    for (const key in object) {
        const value = object[key];
        if (value?.constructor === Object) {
            if (Array.isArray(value)) {
                throw new Error("Sub arrays are not allowed !");
            }
            _handleObject(key, value);
        } else {
            let keyId = keysEntries.get(key);

            if (keyId === undefined) {
                keyId = keysEntries.size;
                keysEntries.set(key, keyId);
                keyArrays.push(key);
            }

            if (value.length) {
                ObjectAsArray[keyId] = `"${value}"`;
            } else {
                ObjectAsArray[keyId] = value;
            }
        }
    }
    return ObjectAsArray;
}

/**
 * @param {Array<object>} array
 * @param {Array<object>} array
 * @return {string} 
 */
function TransformArrayToCsv(array, separator = ',', newLine = '\n') {
    keysEntries = new Map();
    keyArrays = [];
    precomputedOffset = 0;
    _separator = separator;
    // Preprocess object (flatten + compute keys)
    array = array.map(object => handleObject(object));

    // Do headers
    const descriptorLine = keyArrays.join(separator) + newLine;

    // console.log(array);

    // Do entries now
    const body = array.map(object => object.join(separator) + separator.repeat(keysEntries.size - object.length)).join(newLine);

    return descriptorLine + body;
}


/**
 * @param {Array<object>} array
 * @param {Array<object>} array
 * @return {string} 
 */
function TransformArrayToCsvBuffered(array, separator = ',', newLine = '\n') {
    const buffer = new writableBuffer();
    keysEntries = new Map();
    keyArrays = [];
    precomputedOffset = 0;
    _separator = separator;
    // Preprocess object (flatten + compute keys)
    array = array.map(object => handleObject(object));

    // Do headers
    buffer.write(keyArrays.join(separator) + newLine);

    // Do entries now
    array.forEach((object) => {
        buffer.write(object.join(separator) + separator.repeat(keysEntries.size - object.length) + newLine);
    })
    return buffer.render();
}

/*
console.log(TransformArrayToCsv([
    { a: 1 },
    { b: 2 },
    { 'c.d': 'myString' },
    { c: { d: 3, e: 4 }, f: 5 }
], ',', '\n'));
console.log(TransformArrayToCsvBuffered([
    { a: 1 },
    { b: 2 },
    { 'c.d': 'myString' },
    { c: { d: 3, e: 4 }, f: 5 }
], ',', '\n'));
//*/

/*
function ParseCsvToArray(csv, separator, newLine) {

}

const inputCsv = `a,b,c.d,c.e,f
1,,,,
,2,,,
,,myString,,
,,3,4,5`
*/


module.exports = {
    TransformArrayToCsv,
    TransformArrayToCsvBuffered
}
