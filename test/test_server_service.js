/*global require before after describe it emit */


var should = require('should')
var fs = require('fs')

var _ = require('lodash')
var async = require('async')

var config_okay = require('config_okay')
var process_doc = require('../lib/process_county_json')

var save_detectors = require('../lib/save_county_detectors')
var county_detectors_service  = require('../lib/county_detectors_service')

var config={}
var utils = require('./utils')
var task
var test_type ='counties'
var test_name = '06111.all' // Ventura
var test_year = 2007
var viewer = require('couchdb_put_view')
var path    = require('path')
var rootdir = path.normalize(__dirname)
var config_file = rootdir+'/../test.config.json'

before(function(done){
    config_okay(config_file,function(err,c){
        config.couchdb =_.clone(c.couchdb,true)
        var date = new Date()
        var test_db_unique = date.getHours()+'-'
                           + date.getMinutes()+'-'
                           + date.getSeconds()+'-'
                           + date.getMilliseconds()
        config.couchdb.county_detector_collation_db += test_db_unique
        return done()
    })
    return null
})

function load_data(config){
    return function(done){
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
                                    row.should.have.keys('ok','id','rev')
                                    row.ok.should.be.ok
                                    row.id.should.match(/^06\d\d\d_2007_(7\d{5}|wim\.\d+\.[NSEW])/)
                                });
                                return done()
                            });
                        });
                    });
        return null
    }
}

function collater(doc) {
    var m = new RegExp(
        "^(06\\d{3})_(\\d{4})"
    );
    var match = m.exec(doc._id);
    emit([match[1],+match[2]], doc.detector);
}


function make_view(config){
    var ddoc = {
        _id:'_design/'+config.couchdb.design,
        language:"javascript",
        views: {}
    }
    ddoc.views[config.couchdb.view]={
        'map':collater,
        'reduce':'_count'
    }

    return function(done){
        viewer({'db':config.couchdb.county_detector_collation_db
               ,'auth':config.couchdb.auth
               ,'host':config.couchdb.host || '127.0.0.1'
               ,'port':config.couchdb.port || 5984
               ,'doc':ddoc
               },done)
        return null
    }
}

var app,server
var env = process.env;
var testhost = env.TEST_HOST || '127.0.0.1'
var testport = env.TEST_PORT || 3000
var express = require('express')
var http=require('http')
testport += 3

function launch_server(config){
    return function(done){
        app = express()
        county_detectors_service(app,'/county/detectors',config)
        server=http
               .createServer(app)
               .listen(testport,testhost,function(){
                   //console.log('test server up on '+testhost+":"+testport)
                   return done()
               })
        return null
    }
}

after(function(done){
    if(server){
        return server.close(done)
    }else{
        return done()
    }
})

var request = require('request')

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

    //after(utils.demo_db_after(config))

    it('should grab detector data for ventura, 2007',function(done){
        request.get('http://'+testhost+':'+testport
                   +'/county/detectors/ventura/2007.json'
                   ,function(e,r,b){
                        should.not.exist(e)
                        var d = JSON.parse(b)
                        d.should.have.keys('total_rows','rows','offset')
                        d.rows.should.have.lengthOf(68)
                        return done()
                    })

    })
    it('should grab detector data for 06111, 2007',function(done){
        request.get('http://'+testhost+':'+testport
                   +'/county/detectors/06111/2007.json'
                   ,function(e,r,b){
                        should.not.exist(e)
                        var d = JSON.parse(b)
                        d.should.have.keys('total_rows','rows','offset')
                        d.rows.should.have.lengthOf(68)
                        return done()
                    })

    })
})
