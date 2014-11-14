/*global require before after describe it emit console */


var should = require('should')
var fs = require('fs')

var _ = require('lodash')
var async = require('async')

var config_okay = require('config_okay')
var get_records = require('../lib/get_county_overlap_from_sql')

var config={}
var utils = require('./utils')
var task
var test_type ='counties'
var test_name = '06029' // Kern
var test_year = 2009
var path = require('path')
var rootdir = path.normalize(__dirname)
var config_file = rootdir+'/../test.config.json'

console.log(config_file)
before(function(done){
    get_records.configure(config_file,done)
    return null
})

describe('get county detectors list',function(){

    it('should grab detector data for kern, 2007',function(done){
        get_records.query(test_name,2007,function(e,r){
            should.not.exist(e)
            should.exist(r)
            r.should.have.lengthOf(4)
            done()
        })
    })
    it('should grab detector data for kern, 2008',function(done){
        get_records.query(test_name,2008,function(e,r){
            should.not.exist(e)
            should.exist(r)
            r.should.have.lengthOf(4)
            done()
        })
    })
    it('should grab detector data for kern, 2009',function(done){
        get_records.query(test_name,2009,function(e,r){
            should.not.exist(e)
            should.exist(r)
            r.should.have.lengthOf(4)
            done()
        })
    })
    it('should grab detector data for kern, 2009',function(done){
        get_records.query(test_name,2010,function(e,r){
            should.not.exist(e)
            should.exist(r)
            r.should.have.lengthOf(4)
            done()
        })
    })
})
