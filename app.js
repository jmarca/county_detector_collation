/*global console module require */
// all the counties

var get_doc = require('../lib/get_county_json')
var names = require('lib/county_names')
var type ='counties'
var years = [2007,2008,2009]


function  get_doc(opts,next){

    if(opts === undefined || ! opts.areatype || ! opts.year || ! opts.areaname )
        throw new Error('must tell me what file to get in opts object')
    var url = 'http://'
            +calvad
            +'/data6/'
            +opts.areatype
            +'/monthly/'
            +opts.year
            +'/'+opts.areaname
            +'.json'

    var req = request.get(url,function(e,i,r){
                  if(e) return next(e)
                  return next(null,r)

              })
    return null
}

module.exports=get_doc
