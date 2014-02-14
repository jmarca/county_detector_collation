/*global console module require */
// all the counties

var get_doc = require('lib/get_county_json')
var names = require('lib/county_names')
var type ='counties'
var years = [2007,2008,2009]
var async = require('async')
var _ = require('lodash')

// make a queue, load up each combination of year and county name, then execute

var process_doc = require('lib/process_county_json')
var save_listing = require('lib/save_county_detectors')

var q = async.queue(function (task, callback) {
            async.waterfall([function(cb){
                                 get_doc(task,cb)
                                 return null
                             }
                            ,process_doc
                            ,function(listing,cb){
                                 save_listing(task,listing,cb)
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
        q.push({'areatype':type
               ,'areaname':name
               ,'year':year
               }
              , function (err) {
                    console.log('finished');
                });
    })
})
