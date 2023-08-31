const toCsv = require('./index');


const smallPayload = [
    { a: 1 },
    { b: 2 },
    { string: 'my,string' },
    { c: { d: 3, e: 4 }, f: 5 }
];

const bigPayload = [];
for (let index = 0; index < 10000; index++) {
    smallPayload.forEach((payload) => bigPayload.push(payload));
}


setInterval(() => {
    toCsv(bigPayload);
    toCsv(bigPayload);
}, 10)