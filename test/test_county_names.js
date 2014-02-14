/* global require console process describe it before after */

var should = require('should')
var superagent = require('superagent')
var crypto = require('crypto')
var _ = require('lodash')

var names = require('../lib/county_names')

describe('county_names', function() {
  it('should have a 58 counties in it', function() {
      names.should.have.lengthOf(58)
  })
  it('should all look like 06\d\d\d\d.all at the end of them', function() {
      _.each(names,function(name){
          name.should.match(/^06\d\d\d\.all$/)
      })
  })
})
