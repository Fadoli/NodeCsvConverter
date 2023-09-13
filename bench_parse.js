const { ParseCsvToArray: ParseCsvToArray } = require('./index');
const toCsv42 = require('csv42');
const papaparse = require('papaparse');
const csv2json = require('json-2-csv').csv2json;

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;


const inputCsv = `a,b,c.d,c.e,f
1,,,,
,2,,,
,,myString,,
,,3,4,5
1,,,,
,2,,,
,,myString,,
,,3,4,5
1,,,,
,2,,,
,,myString,,
,,3,4,5
1,,,,
,2,,,
,,myString,,
,,3,4,5
1,,,,
,2,,,
,,myString,,
,,3,4,5`

const targetedPayload = inputCsv;
const length = targetedPayload.length;
const opts = {};

console.log(papaparse.parse(targetedPayload, { header: true, delimiter: ',', newline: '\n' }));
// csv2json(targetedPayload, opts).then(console.log);
console.log(toCsv42.csv2json(targetedPayload));
console.log(ParseCsvToArray(targetedPayload));

// add tests
suite
    .add('papaparse : parse', function () {
        papaparse.parse(targetedPayload, { header: true, delimiter: ',', newline: '\n' });
    })
    /*
    .add('json-2-csv : csv2json', async function () {
        await csv2json(targetedPayload, opts);
    })
    */
    .add('csv42', function () {
        toCsv42.csv2json(targetedPayload);
    })
    .add('node-csv-converter : ParseCsvToArray', function () {
        ParseCsvToArray(targetedPayload);
    })
    .add('node-csv-converter : ParseCsvToArray with no empty values', function () {
        ParseCsvToArray(targetedPayload, { filterEmptyValues: true });
    })
    // add listeners
    .on('cycle', function (event) {
        console.log(String(event.target) + ` reaching ${length * 1 / (event.target.stats.mean * 1024 * 1024)}MB/s `);
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    // run async
    .run({ 'async': true });