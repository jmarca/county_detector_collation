/* global require console process describe it before after */

var should = require('should')
var superagent = require('superagent')
var crypto = require('crypto')

var get_doc = require('../lib/get_county_json')

var test_type ='counties'
var test_name = '06111.all' // Ventura
var test_year = 2007

var expected = {
    'md5sum': 'ece536995cebe7911721842b93380687'
  ,'sha256sum':'837450b8df495ca686a0886f31e1f06546feffa843b01f4e413a5c693975bb51'
}
function md5 (str) {
  return crypto.createHash('md5').update(str).digest('hex')
}
function sha256 (str) {
  return crypto.createHash('sha256').update(str).digest('hex')
}


describe('get county json',function(){
    it('should get ventura county, 2007',function(done){
        get_doc({'areatype':test_type
                ,'areaname':test_name
                ,'year':test_year
                }
               ,function(e,blob){
                    md5(blob).should.equal(expected.md5sum)
                    sha256(blob).should.equal(expected.sha256sum)
                    done()
                })
    })

})