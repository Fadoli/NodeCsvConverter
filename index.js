let keysEntries, ObjectAsArray;
let keysCount = 0;
let keyArrays;
let _separator;

// 1MB pre-allocated
const precomputedHeaders = Buffer.alloc(1024 * 1024 * 1024);
let precomputedOffset = 0;

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
            let keyId;
            if (!keysEntries.has(newKey)) {
                keyId = (keysCount++);
                keysEntries.set(newKey,keyId);
                keyArrays.push(newKey);
            } else {
                keyId = keysEntries.get(newKey);
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
    ObjectAsArray = new Array(keysCount);
    for (const key in object) {
        const value = object[key];
        if (value?.constructor === Object) {
            if (Array.isArray(value)) {
                throw new Error("Sub arrays are not allowed !");
            }
            _handleObject(key, value);
        } else {
            let keyId;
            if (!keysEntries.has(key)) {
                keyId = (keysCount++);
                keysEntries.set(key,keyId);
                keyArrays.push(key);
            } else {
                keyId = keysEntries.get(key);
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
    keysCount = 0;
    precomputedOffset = 0;
    _separator = separator;
    // Preprocess object (flatten + compute keys)
    array = array.map(object => handleObject(object));

    // Do headers
    const descriptorLine = keyArrays.join(separator) + newLine
    // precomputedHeaders.write(newLine, precomputedOffset - 1);
    // const descriptorLine = precomputedHeaders.subarray(0, precomputedOffset).toString()

    // console.log(array);

    // Do entries now
    const body = array.map(object => object.join(separator) + separator.repeat(keysCount - object.length)).join(newLine);

    return descriptorLine + body;
}

//*
console.log(TransformArrayToCsv([
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


module.exports = TransformArrayToCsv
