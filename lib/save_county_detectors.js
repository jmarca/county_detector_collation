
var _ = require('lodash')
var savermaker = require('couchdb_bulkdoc_saver')
function save_detector_list(task,detectors,next){

    var bulkdoc_saver = savermaker(task.config.couchdb.detector_db
                                  ,{'user':task.config.couchdb.auth.username
                                   ,'pass':task.config.couchdb.auth.password
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
