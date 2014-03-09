/*global console module require */
// all the counties

var get_doc = require('./lib/get_county_json')
var names = require('./lib/county_names')
var type ='counties'
var years = [2007,2008,2009]
var async = require('async')
var _ = require('lodash')
var request = require('request')

// make a queue, load up each combination of year and county name, then execute

var process_doc = require('./lib/process_county_json')
var save_detectors = require('./lib/save_county_detectors')

var config={}
var config_okay = require('config_okay')

function process(config){

    var q = async.queue(function (task, callback) {
                async.waterfall([function(cb){
                                     get_doc(task,cb)
                                     return null
                                 }
                                ,process_doc
                                ,function(listing,cb){
                                     save_detectors(task,listing,cb)
                                     return null
                                 }
                                ]
                               ,callback
                               )
                return null
            }, 4);


    // assign a callback
    q.drain = function() {
        console.log('all items have been processed');
    }

    // load up the queue
    _.each(names,function(name){
        _.each(years,function(year){
            var task = {'areatype':type
                   ,'areaname':name
                   ,'year':year
                   }
            task.config=config
            q.push(task
                  , function (err) {
                        console.log('finished');
                    });
        })
    });
    return null;
}

function create_db(config,cb){
    var cdb =
        [config.couchdb.url+':'+config.couchdb.port
        ,config.couchdb.detector_db].join('/')
    request.put(cdb
               ,{
                   'content-type': 'application/json',
                   'auth': {
                       'user': config.couchdb.auth.username,
                       'pass': config.couchdb.auth.password,
                       'sendImmediately': false
                   }
               }
               ,function(e,r){
                    console.log('done, making db: '+r)
                    cb(e)
                }
               )
    return null
}

config_okay('config.json',function(err,c){
    config.couchdb =_.clone(c.couchdb,true)
    async.applyEachSeries([create_db
                          ,process]
                         ,config
                         ,function(){
                              console.log('done done')
                          })

})
