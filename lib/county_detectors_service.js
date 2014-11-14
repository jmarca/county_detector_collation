/* global require exports console JSON process */

// service for connecting requests through to the couchdb storing the
// county/detector data.

var superagent = require('superagent')
var _ = require('lodash');

var env = process.env

var toQuery = require('couchdb_toQuery')

var county_lookup = require('geom_utils').county_lookup()

var config={}
var config_okay = require('config_okay')



function make_piper(resp){
    return function nullparser(r, fn){
        r.pipe(resp)
        r.on('end', function(a,b){
            resp.end()
            fn(a,b)
        })
    }
}



function _rewriter (req,res,next){
    var fips = req.params.fips
    var year = req.params.year
    var couchdb = 'http://'
                +config.couchdb.host+':'
                +config.couchdb.port +'/'
                +config.couchdb.detector_db
    var design_doc = ['_design'
                     ,config.couchdb.design
                     ,'_view'
                     ,config.couchdb.view].join('/')
    var query ={'reduce':false
               ,'key':[fips,+year]
               }
    var to = couchdb+'/'+design_doc+'?'+toQuery(query)

    superagent.get(to)
    .parse(make_piper(res))
    .end()
    return null
}

var configfile = 'config.json'

function rewriter(req,res,next){
    if(config.couchdb === undefined){
        config_okay(configfile,function(err,c){
            config.couchdb =_.clone(c.couchdb,true)
            return _rewriter(req,res,next)
        })
    }else{
        return _rewriter(req,res,next)
    }
}


// validate input
var fips_pattern =  /^06\d{3}/
var validate_input = require('validation')
var asInt   =validate_input.asInt
function isCountyOrFips(name){
    return function(req,res,next,n){
        if(!fips_pattern.test(n)) {
            n = county_lookup[n.toUpperCase()]
            if(n === undefined){
                return next('route')
            }
        }
        req.params[name]= n
        return next()
    }
}

module.exports = function(app,prefix,_configfile){
    if(!prefix){
        prefix='/county/detectors'
    }
    if(_configfile){

        if(_.isObject(_configfile)){
            config=_configfile
        }else{
            configfile=_configfile
        }
    }
    app.get(prefix+'/:fips/:year.:format?'
           ,rewriter);
    app.param('fips',isCountyOrFips('fips'))
    app.param('year',asInt('year'))
    return app
}
