/* global require console process describe it before after */

var should = require('should')
var _ = require('lodash')
var fs = require('fs')

var process_doc = require('../lib/process_county_json')

var test_type ='counties'
var test_name = '06111.all' // Ventura
var test_year = 2007

describe('process county json',function(){
    it('should process ventura county, 2007',function(done){
        fs.readFile('test/files/'+test_name+'.json'
                   ,{'encodingo':'utf8'}
                   ,function(e,blob){
                    process_doc(blob,function(e,l){
                        _.each(l,function(detector){
                            detector.should.match(/^(7\d{5}|wim)/)
                        })
                        l.should.have.lengthOf(68)
                        done()
                    })
                })
    })

})
