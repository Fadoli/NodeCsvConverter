const toCsv = require('./index');
const toCsv42 = require('csv42');
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

const smallPayload = [
    { a: 1 },
    { b: 2 },
    { string: 'my,string' },
    { c: { d: 3, e: 4 }, f: 5 }
];

const bigPayload = [];
for (let index = 0; index < 100; index++) {
    smallPayload.forEach((payload) => bigPayload.push(payload));
}

const targetedPayload = bigPayload;
/*
console.log(toCsv42.json2csv(targetedPayload).length)
console.log(toCsv(targetedPayload).length)
console.log(toCsv42.json2csv(targetedPayload))
console.log(toCsv(targetedPayload))
*/
const length = toCsv42.json2csv(targetedPayload).length;

// add tests
suite
    .add('toCsv42', function () {
        toCsv42.json2csv(targetedPayload);
    })
    .add('toCsv', function () {
        toCsv(targetedPayload);
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