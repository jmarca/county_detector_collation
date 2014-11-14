/*global require console */
// select vds_id,name from vds_points_4326 v join geom_points_4326 p on (v.gid=p.gid) join carb_counties_aligned_03 c on (p.geom && c.geom4326) where vds_id=601339;

// counties_fips holds the county to fips relationship

var geoQuery = require('detector_postgis_query').geoQuery
var _ = require('lodash')
var configurator = require('./config')()
exports.configure=configurator

// in the loop.

// needs an express.request object?  really?
// used as an object.  req.params only.
// req needs:
//   req.params.zoom  // not needed for county-wide work
//   req.params.year  // required
//   req.params.month // optional
//   req.params.aggregate (defaults to 'hourly')
//   req.params[opts.area_type_param] // counties or basins or districts
//   req.params[opts.area_param] // the fips code  or basin or district
//

var req = {params : {'type':'area'
                   ,'area':'counties'
                   ,'county':'' // fips code
                   ,'year':2007 // year
                   ,'zoom':14
                   }
          }

function fips_callback(fips,year,next){
    // wrapped in a generator to store the fips for callback
    return function(err,features){
        // here I have all of the features for this whatever it is called
        if(err){return next(err)}
        console.log('fips: '+fips)
        var extract = _.map(features,function(f){
                          return {'detector_id':f.properties.detector_id
                                 ,'direction':f.properties.direction
                                 ,year:year
                                 }
                      })
        extract = _.unique(extract,function(e){
                      return[e.detector_id,e.direction,e.year].join('-')
                  })
        console.log(extract)

        if(next) return  next(err,extract)
        return null
    }
}

var pg = require('pg');

function query(fips,year,next){
    function _query(error,c){
        if(_.isEmpty(c)){
            throw new Error('croak:  need to call configurator first')
        }
        console.log(c)
        var user = c.postgres.username
        var pass = c.postgres.password
        var db = c.postgres.db
        var host = c.postgres.host
        var port = c.postgres.port
        var connectionString  = "pg://"+user+":"+pass+"@"+host+":"+port+"/"+db;
        console.log(connectionString)

        var doneGeo = fips_callback(fips,year,next)
        var task = _.clone(req)
        task.params.county = fips
        task.params.year = year
        console.log(task)
        var doGeo = geoQuery(task,{'area_param': 'county'
                                  ,'area_type_param': 'area'
                                  ,'with_clause_format':true}
                            ,doneGeo)
        pg.connect(connectionString, doGeo);

        return null
    }
    configurator(null,_query)

}

exports.query = query