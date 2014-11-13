/*global require before after describe */


var should = require('should')
var fs = require('fs')

var _ = require('lodash')

var config_okay = require('config_okay')
var process_doc = require('../lib/process_county_json')

var save_detectors = require('../lib/save_county_detectors')

var config={}
var utils = require('./utils')
var task
var test_type ='counties'
var test_name = '06111.all' // Ventura
var test_year = 2007
var path    = require('path')
var rootdir = path.normalize(__dirname)
var config_file = rootdir+'/../test.config.json'


before(function(done){
    config_okay(config_file,function(err,c){
        console.log(err)
        console.log(c)
        if(err) throw new Error(err)
        config.couchdb =_.clone(c.couchdb,true)
        var date = new Date()
        var test_db_unique = date.getHours()+'-'
                           + date.getMinutes()+'-'
                           + date.getSeconds()+'-'
                           + date.getMilliseconds()
        config.couchdb.detector_db += test_db_unique
        return done()
    })
    return null
})

describe('save county detectors',function(){
    before(utils.demo_db_before(config))
    after(utils.demo_db_after(config))
    it('should save the detector data for ventura, 2007',function(done){
        var task = {'areatype':test_type
                   ,'areaname':test_name
                   ,'year':test_year
                   }
        task.config=config
        fs.readFile('test/files/'+test_name+'.json'
                   ,{'encoding':'utf8'}
                   ,function(e,blob){
                        process_doc(blob,function(e,l){
                            // save the list
                            save_detectors(task,l,function(e,r){
                                should.not.exist(e)
                                r.should.have.lengthOf(68)
                                _.each(r,function(row){
                                    row.should.have.keys(['ok','id','rev'])
                                    row.ok.should.be.ok
                                    row.id.should.match(/^06\d\d\d_2007_(7\d{5}|wim\.\d+\.[NSEW])/)
                                })
                                done()
                            });
                        });
                    });
    })
})
