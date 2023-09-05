const { TransformArrayToCsv: toCsv, TransformArrayToCsvBuffered: toCsvBuffered } = require('./index');


/*
const smallPayload = [
    { a: 1 },
    { b: 2 },
    { string: 'my,string' },
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
for (let index = 0; index < 100; index++) {
    smallPayload.forEach((payload) => bigPayload.push(payload));
}

setInterval(() => {
    toCsvBuffered(bigPayload);
    toCsvBuffered(bigPayload);
}, 1)