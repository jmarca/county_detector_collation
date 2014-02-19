/* global require exports console JSON process */

// service for connecting requests through to the couchdb storing the
// county/detector data.

var superagent = require('superagent')
var _ = require('lodash');

var env = process.env

var toQuery = require('couchdb_toQuery')

var county_lookup = require('geom_utils').county_lookup()

var config={}
var config_okay = require('./config_okay')
function configure(next){
    config_okay('config.json',function(err,c){
        config.couchdb =_.clone(c.couchdb,true)
        return next(err)
    })
    return null
}

function make_piper(resp){
    return function nullparser(r, fn){
        r.pipe(resp)
        r.on('end', function(a,b){
            resp.end()
            fn(a,b)
        })
    }
}



var fips_pattern =  /\d{6}/
function _rewriter (req,res,next){
    var fips = req.params.fips
    var year = req.params.year
    var couchdb = config.couchdb.url+':'
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

function rewriter(req,res,next){
    if(config.couchdb === undefined){
        configure(function(){
            return _rewriter(req,res,next)
        })
    }else{
        return _rewriter(req,res,next)
    }
}


// validate input
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

exports.couchdb_rewrite_service = function(app){
    app.get('/county/detectors/:fips/:year'
           ,rewriter);
    app.param('fips',isCountyOrFips('fips'))
    app.param('year',asInt('year'))
    return app
}
