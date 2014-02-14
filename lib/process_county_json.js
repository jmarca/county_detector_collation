/*global require module */

var _ = require('lodash')
var skipto = 15
function process_doc(doc,next){
    var data = JSON.parse(doc)
    // data.data
    var l = {}
    _.each(data.features[0].properties.data,function(row){
        // last entries in the row are the detectors used in that
        // month's solution
        var detectors = row.slice(skipto)
        _.each(detectors,function(d){
            l[d]=1 // use the hash to keep unique detectors
        });
    });
    next(null,_.keys(l))
}

module.exports=process_doc