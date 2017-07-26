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
          if(fs.existsSync(path.join(this.dirBundles, bundle, 'config.js'))) {
            var config = require(path.join(this.dirBundles, bundle, 'config.js'));
            if(config.injection && config.injection[loadType]){
              for(var i in config.injection[loadType]){
                //console.log(loadType+" - "+i+" - "+config.injection[loadType][i].name);
                load[config.injection[loadType][i].name] = { 
                  object: path.join(this.dirBundles, bundle, config.injection[loadType][i].object), 
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
          if(fs.existsSync(path.join(this.dirBundles, bundle, 'config.js'))) {
            var config = require(path.join(this.dirBundles, bundle, 'config.js'));
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
    var countReload = {};
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
          countReload[loadIndex] = (countReload[loadIndex]) ? countReload[loadIndex]+=1 : 1;
          reload.push(loadIndex);
          if(countReload[loadIndex] >= 100) {
            di.event.newError("GraoLoader - tryLoad: "+loadType+"/"+loadIndex+" more 100 times");
            di.event.newError(err);
            process.exit(1);
          }
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