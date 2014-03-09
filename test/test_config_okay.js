/* global require console process it describe after before */

var should = require('should')

var async = require('async')
var _ = require('lodash')
var fs = require('fs')

var config_okay = require('config_okay')

describe('config_okay',function(){
    var options;
    it('should parse okay a file in with mode 0600'
      ,function(done){
           config_okay('test.config.json',function(err,c){
               should.not.exist(err)
               should.exist(c)
               c.should.have.property('couchdb')

               c.couchdb.should.have.keys('url'
                                         ,'port'
                                         ,'auth'
                                         ,'detector_db'
                                         )
               c.couchdb.auth.should.have.keys('username','password')

               return done()
           })

       })
})
