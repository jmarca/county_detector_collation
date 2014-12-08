/*global require exports */
var request = require('request')
var async = require('async')
var _ = require('lodash')
var should = require('should')

function create_tempdb(config,cb){
    var cdb =
        ['http://'+config.couchdb.host+':'+config.couchdb.port
        ,config.couchdb.db].join('/')
    request.put(cdb
               ,{
                   'content-type': 'application/json',
                   'auth': {
                       'user': config.couchdb.auth.username,
                       'pass': config.couchdb.auth.password,
                       'sendImmediately': false
                   }
               }
               ,cb
               )
    return null
}


function demo_db_before(config){
    return function(done){
        // dummy up a done grid and a not done grid in a test db
        var dbs = [config.couchdb.county_detector_collation_db
                  ]

        async.each(dbs
                  ,function(db,cb){
                       if(!db) return cb()
                       config.couchdb.db=db
                       create_tempdb(config,cb)
                       return null
                   }
                  ,done)
        return null
    }

}
function demo_db_after(config){
    return  function(done){

        var dbs = [config.couchdb.county_detector_collation_db
                  ]

        async.each(dbs
                  ,function(db,cb){
                       if(!db) return cb()
                       var cdb =
                           [config.couchdb.url+':'+config.couchdb.port
                           ,db].join('/')
                       request.del(cdb
                                  ,{
                                      'content-type': 'application/json',
                                      'auth': {
                                          'user': config.couchdb.auth.username,
                                          'pass': config.couchdb.auth.password,
                                          'sendImmediately': false
                                      }
                                  }
                                  ,cb)
                       return null
                   }
                  ,function(){
                       done()
                   });
        return null

    }
}


exports.create_tempdb = create_tempdb
exports.demo_db_after = demo_db_after
exports.demo_db_before= demo_db_before
