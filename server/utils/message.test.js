'use strict';

let expect = require('expect');
let {generateMessage} = require("./message");

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    const from = "from text";
    const text = "body text";
    let resultObj = generateMessage(from, text);

    expect(resultObj).toInclude({from, text});
    expect(resultObj.createdAt).toBeA('number');
  });
});
