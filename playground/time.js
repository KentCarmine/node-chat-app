'use strict';

const moment = require('moment');

// let date = new Date().getMonth();
//
// console.log(date);

let createdAt = 1234;
let date = moment(createdAt);
// date.add(100, 'year').subtract(9, 'months');
// console.log(date.format('MMM Do, YYYY'));

console.log(date.format('h:mm a'));
