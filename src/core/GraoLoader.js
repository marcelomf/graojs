var fs, path;

var GraoLoader = function(di) {
  fs = di.fs;
  path = di.path;
  this.dirBundles = di.config.bundles;
  
  this.loading = function(loadType) {
    var bundles = fs.readdirSync(this.dirBundles);
    var load = new Array();
    
    switch(loadType) {
      case 'controller':
      case 'model':
      case 'route':
      case 'schema':
      case 'validator':
        for(var bundleIndex in bundles) {
          bundle = bundles[bundleIndex];
          if(fs.existsSync(this.dirBundles+'/'+bundle+'/config.js')) {
            var config = require(this.dirBundles+'/'+bundle+'/config.js');
            if(config.injection && config.injection[loadType]){
              for(var i in config.injection[loadType]){
                load[config.injection[loadType][i].name] = { 
                  object: this.dirBundles+'/'+bundle+'/'+config.injection[loadType][i].object, 
                  di: (config.injection[loadType][i].di) ? config.injection[loadType][i].di : {}
                };
              }
            }
          }
        }
        break;
      case 'publicRoute':
        for(var bundleIndex in bundles) {
          bundle = bundles[bundleIndex];
          if(fs.existsSync(this.dirBundles+'/'+bundle+'/config.js')) {
            var config = require(this.dirBundles+'/'+bundle+'/config.js');
            if(config.publicRoutes){
              for(var i in config.publicRoutes){
                load[config.publicRoutes[i].webdir] = config.publicRoutes[i].fsdir;
              }
            }
          }
        }
        break;
      default:
        throw 'Invalid loadType!';
    }
    return load;
  }

  this.tryLoad = function(originalLoad, di, loadType) {
    var reload = new Array();
    function loading(loads) {
      for(loadIndex in loads) {
        try {
          for(iDi in loads[loadIndex].di) {
            di[iDi] = loads[loadIndex].di[iDi];
          }
          di[loadType][loadIndex] = new (require(loads[loadIndex].object))(di);
          var indexReload = reload.indexOf(loadIndex);
          if(indexReload >= 0)
            reload.splice(indexReload, 1);
        } catch(err) {
          //throw err;
          reload.push(loadIndex);
        }
      }

      while(reload.length > 0) {
        var newLoad = new Array();
        for(indexReload in reload) {
          newLoad[reload[indexReload]] = originalLoad[reload[indexReload]];
        }
        loading(newLoad);
      }
    }
    loading(originalLoad);
    return di[loadType];
  }
}
module.exports = exports = GraoLoader;