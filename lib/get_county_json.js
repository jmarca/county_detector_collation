/*global console module */
// get the json file from calvad

var request = require('request')

var calvad = 'calvad.ctmlabs.net'

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
