
/* eslint-disable camelcase */
var Sequelize = require('sequelize');
var db = require('./_db');
var Place = require('./place');

var Day = db.define('day', {
  number: {
  	type: Sequelize.INTEGER,
  	unique: true
  }
});

module.exports = Day;



// Day
//
// number - integer stating which day it is
// ...and should have the following associations
//
// hotel (singular)
// restaurants (plural)
// activities (plural)
