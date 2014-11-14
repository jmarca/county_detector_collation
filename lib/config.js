var config_okay = require('config_okay')
var _ = require('lodash')

// pass in a file, get back a function that you can call to get the
// current config state

function configurator(){
    var config={}
    console.log('called configurator, returning callback function')
    return function(config_file,cb){
        console.log('configuring the  configurator')
        if(_.isEmpty(config)){
            console.log('config is empty, looking for: '+config_file)
            config_okay(config_file,function(err,_config){
                if(err){
                    throw new Error(err)
                }
                config = _config
                console.log({'config':config})
                if(cb){ cb(null,config) }
                return _.extend({},config)
            })
        }else{
            // have config file loaded already
            var mixed = _.extend({},config)
            if(_.isObject(config_file)){
                mixed = _.extend({},config,config_file)
            }
            if(cb){ cb(null,mixed) }
            return mixed
        }
        // not going to get here...
        return null
    }
}

module.exports = configurator