/*global require before after describe it */


var should = require('should')
var fs = require('fs')

var _ = require('lodash')
var async = require('async')

var config_okay = require('../lib/config_okay')
var process_doc = require('../lib/process_county_json')

var save_detectors = require('../lib/save_county_detectors')

var config={}
var utils = require('./utils')
var task
var test_type ='counties'
var test_name = '06111.all' // Ventura
var test_year = 2007

before(function(done){
    config_okay('test.config.json',function(err,c){
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

function load_data(config){
    return function(done){
        return done('not yet implemented')
    }
}
function make_view(config){
    return function(done){
        return done('not yet implemented')
    }
}
function launch_server(config){
    return function(done){
        return done('not yet implemented')
    }
}
describe('save county detectors',function(){
    before(function(done){
        // set up the fake couchdb, populate with data, launch the server
        async.series([utils.demo_db_before(config)
                     ,load_data(config)
                     ,make_view(config)
                     ,launch_server(config)
                     ]
                    ,done)
        return null
    })

    after(utils.demo_db_after(config))
    it('should save grab detector data for ventura, 2007',function(done){
        // first load up the data
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
