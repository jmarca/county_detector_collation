
var _ = require('lodash')
var savermaker = require('couchdb_bulkdoc_saver')
function save_detector_list(task,detectors,next){
    console.log('saving detectors')
    var bulkdoc_saver = savermaker(task.config.couchdb.county_detector_collation_db
                                  ,{'user':task.config.couchdb.auth.username
                                   ,'pass':task.config.couchdb.auth.password
                                   ,'host':task.config.couchdb.host ||
                                    '127.0.0.1'
                                   ,'port':task.config.couchdb.port || 5432
                                   })

    // make docs out of the combination of task and list
    var docs =
        _.map(detectors,function(detector){
            var fips = task.areaname.substr(0,5)
            return {'_id':[fips,task.year,detector].join('_')
                   ,'detector':detector
                   }
        })
    bulkdoc_saver({'docs':docs},next)
    return null

}

module.exports=save_detector_list
