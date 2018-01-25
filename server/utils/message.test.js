'use strict';

let expect = require('expect');
let {generateMessage, generateLocationMessage} = require("./message");

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    const from = "from text";
    const text = "body text";
    let resultObj = generateMessage(from, text);

    expect(resultObj).toInclude({from, text});
    expect(resultObj.createdAt).toBeA('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate the correct location message object', () => {
    const from = 'Test';
    const lat = 50.2;
    const lng = 60.1;
    let resultObj = generateLocationMessage(from, lat, lng);

    expect(resultObj.from).toBe(from);
    expect(resultObj.createdAt).toBeA('number');
    expect(resultObj.url).toBe(`https://www.google.com/maps?q=${lat},${lng}`)
  });
});
