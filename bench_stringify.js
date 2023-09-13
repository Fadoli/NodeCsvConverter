const { TransformArrayToCsv: toCsv, TransformArrayToCsv2: toCsv2 } = require('./index');
const toCsv42 = require('csv42');
const papaparse = require('papaparse');
const json2csv = require('@json2csv/plainjs').Parser;
const json2csv2 = require('json-2-csv').json2csv;

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

/*
const smallPayload = [
    { a: 1 },
    { b: 2 },
    { string: 'my,string'  },
    { c: { d: 3, e: 4 }, f: 5 }
];
*/

const smallPayload = [
    { a: 1, b: 2, c: 3, string: 'my,string', anotherstring: 'short', longString: '2023-09-05T16:11:22.379Z' },
    { a: 1, b: 2, c: 3, string: 'my,string', anotherstring: 'short', longString: '2023-09-05T16:11:22.379Z' },
    { a: 1, b: 2, c: 3, string: 'my,string', anotherstring: 'short', longString: '2023-09-05T16:11:22.379Z' },
    { a: 1, b: 2, c: 3, string: 'my,string', anotherstring: 'short', longString: '2023-09-05T16:11:22.379Z' },
    { a: 1, b: 2, c: 3, string: 'my,string', anotherstring: 'short', longString: '2023-09-05T16:11:22.379Z' },
    { a: 1, b: 2, c: 3, string: 'my,string', anotherstring: 'short', longString: '2023-09-05T16:11:22.379Z' },
    { a: 1, b: 2, c: 3, string: 'my,string', anotherstring: 'short', longString: '2023-09-05T16:11:22.379Z' },
    { a: 1, b: 2, c: 3, string: 'my,string', anotherstring: 'short', longString: '2023-09-05T16:11:22.379Z' },
    { a: 1, b: 2, c: 3, string: 'my,string', anotherstring: 'short', longString: '2023-09-05T16:11:22.379Z' },
    { a: 1, b: 2, c: 3, string: 'my,string', anotherstring: 'short', longString: '2023-09-05T16:11:22.379Z' },
];

const bigPayload = [];
for (let index = 0; index < 10; index++) {
    smallPayload.forEach((payload) => bigPayload.push(payload));
}

const targetedPayload = bigPayload;
console.log(toCsv42.json2csv(targetedPayload).length)
/*
console.log(toCsv(targetedPayload).length)
console.log(toCsv42.json2csv(targetedPayload))
console.log(toCsv(targetedPayload))
*/
const length = toCsv42.json2csv(targetedPayload).length;
const opts = {};

// add tests
suite
    /*
        .add('papaparse', function () {
            papaparse.unparse(targetedPayload, { delimiter: ',', newline: '\n' });
        })
        .add('json-2-csv', async function () {
            const parser = await json2csv2(targetedPayload, opts);
        })
        .add('@json2csv/plainjs', function () {
            const parser = new json2csv(opts);
            parser.parse(targetedPayload);
        })
        .add('csv42', function () {
            toCsv42.json2csv(targetedPayload);
        })
        //*/
    .add('node-csv-converter', function () {
        toCsv(targetedPayload);
    })
    .add('node-csv-converter2', function () {
        toCsv2(targetedPayload);
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