let keysEntries, ObjectAsArray;
let keysCount = 0;
let _separator;

// 1MB pre-allocated
const precomputedHeaders = Buffer.alloc(1024 * 1024 * 1024);
let precomputedOffset = 0;

function _handleObject(prefix, object) {
    for (const key in object) {
        const value = object[key];
        const newKey = `${prefix}.${key}`;
        if (Array.isArray(value)) {
            throw new Error("Sub arrays are not allowed !");
        }
        if (value && value.constructor === Object) {
            _handleObject(newKey, value);
        } else {
            let keyId = keysEntries[newKey];
            if (keyId === undefined) {
                keyId = keysCount;
                keysCount++;
                keysEntries[newKey] = keyId;
                precomputedHeaders.write(newKey + _separator, precomputedOffset);
                precomputedOffset += newKey.length + 1;
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
        if (Array.isArray(value)) {
            throw new Error("Sub arrays are not allowed !");
        }
        if (value && value.constructor === Object) {
            _handleObject(key, value);
        } else {
            let keyId = keysEntries[key];
            if (keyId === undefined) {
                keyId = (keysCount++);
                keysEntries[key] = keyId;
                precomputedHeaders.write(key + _separator, precomputedOffset);
                precomputedOffset += key.length + 1;
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
    keysEntries = {};
    keysCount = 0;
    precomputedOffset = 0;
    _separator = separator;
    // Preprocess object (flatten + compute keys)
    array = array.map(object => handleObject(object, keysEntries));

    // Do headers
    // const descriptorLine = Object.keys(keysEntries).join(separator) + newLine;
    precomputedHeaders.write(newLine, precomputedOffset - 1);
    const descriptorLine = precomputedHeaders.subarray(0, precomputedOffset).toString()

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
