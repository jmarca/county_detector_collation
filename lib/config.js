var config_okay = require('config_okay')
var _ = require('lodash')

// pass in a file, get back a function that you can call to get the
// current config state

function configurator(config_file){
    var config={}
    return function(c,cb){
        if(_.isEmpty(config)){
            config_okay(config_file,function(err,_config){
                if(err){
                    throw new Error(err)
                }
                config = _config

                var mixed = _.extend({},config,c)
                return cb(null,mixed)
            })
        }else{
            // have config file loaded already
            var mixed = _.extend({},config,c)
            return cb(null,mixed)
        }
        return null
    }
}

module.exports = configurator