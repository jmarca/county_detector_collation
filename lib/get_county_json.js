/*global console module */
// get the json file from calvad

var request = require('request')

var configurator = require('./config')()
exports.configure=configurator


function  get_doc(opts,next){
    function _get_doc(err,config){
        var calvad=config.calvad.url
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
    console.log('calling configurator ')
    configurator(null,_get_doc)
    return null
}
exports.get_doc=get_doc
