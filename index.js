let keysEntries, ObjectAsArray;
let keyArrays;

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
function TransformArrayToCsv(array, separator = ',', newLine = '\r\n') {
    keysEntries = new Map();
    keyArrays = [];
    precomputedOffset = 0;
    // Preprocess object (flatten + compute keys)
    array = array.map(object => handleObject(object));

    // Do headers
    const descriptorLine = keyArrays.join(separator) + newLine;

    // console.log(array);

    // Do entries now
    const keySize = keysEntries.size;
    const body = array.map(object => object.join(separator) + separator.repeat(keySize - object.length)).join(newLine);

    return descriptorLine + body;
}

/**
 * @param {Array<object>} array
 * @param {Array<object>} array
 * @return {string} 
 */
function TransformArrayToCsv2(array, separator = ',', newLine = '\n') {
    keysEntries = new Map();
    keyArrays = [];
    precomputedOffset = 0;
    // Preprocess object (flatten + compute keys)
    array = array.map(object => handleObject(object));

    const output = [];
    output.push(keyArrays.join(separator));
    const keySize = keysEntries.size;
    output.push(array.map(object => object.join(separator) + separator.repeat(keySize - object.length)));
    return output.join(newLine);
}


//*
function ParseCsvToArray(csv, separator, newLine) {

}

const inputCsv = `a,b,c.d,c.e,f
1,,,,
,2,,,
,,myString,,
,,3,4,5`
//*/


module.exports = {
    TransformArrayToCsv,
    TransformArrayToCsv2,
    TransformArrayToCsvBuffered: (...stuff) => Buffer.from(TransformArrayToCsv(...stuff))
}
