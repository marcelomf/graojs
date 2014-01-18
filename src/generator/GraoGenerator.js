var
  path = require('path') ,
  fs = require('fs-extra'),
  swig = require('swig'),
  path = require('path'),
  prompt = require('prompt');

var walk = function (dir) {
  var results = []
  var list = fs.readdirSync(dir)
  list.forEach(function (file) {
    file = dir + '/' + file
    var stat = fs.statSync(file)
    if (stat && stat.isDirectory()) results = results.concat(walk(file))
    else results.push(file)
  })
  return results;
}

var GraoGenerator = function () {

  var self = this;

  this.config = {};
  this.defaults = {};
  this.skelPath = null;
  this.skelFilename = '';
  this.skelDefaultFilename = 'skeleton.json';
  this.currentDir = process.cwd();
  this.defaultSkels = {
    "app": "skeletons/app",
    "bundle": "skeletons/bundle",
    "schemabundle": "skeletons/schemabundle",
    "schema": "skeletons/schema"
  };
  this.args = {};
  this.argsSwig = {};

  this.init = function (type, skeleton) {
    this.skelPath = skeleton === null
                  ? path.join(__dirname, '/../../', this.defaultSkels[type])
                  : skeleton;

    this.skelFilename = path.join(this.skelPath, this.skelDefaultFilename);
    this.config = JSON.parse(
      fs.readFileSync(this.skelFilename, 'utf8').toString().replace(/\n/g, '')
    );

    var defaultData = path.join(process.cwd(), '/config/default.skeleton.json');
    this.defaults = fs.existsSync(defaultData)
                  ? JSON.parse(fs.readFileSync(defaultData))
                  : {};

  }

  this.generate = function (args, force, callback) {

    console.log("\n" + ( 'Loading from: ' + this.skelFilename ).green + "\n");

    args = this.prepareArgs(args, this.skelPath);

    var tpls = this.prepareTplPaths(this.config, this.skelPath, args);

    self.writeTpls(tpls, args, force, callback);

  };


  this.prepareArgs = function (args, sourcePath) {

    var newargs = {};

    Object.keys(this.defaults).forEach(function (key) {
        newargs[key] = self.defaults[key];
    });

    var tmpargs = args;

    Object.keys(args).forEach(function (key) {
      newargs[key] = tmpargs[key];
    });

    newargs['sourcePath'] = sourcePath;
    return newargs;

  }

  this.prepareTplPaths = function (config, sourcePath, args) {

    var sourceFiles = walk(sourcePath);
    var tpls = {};

    for (var i in sourceFiles) {

      if (fs.statSync(sourceFiles[i]).isFile()) {

        if (
          !this.checkIgnore(config.ignores, sourceFiles[i], sourcePath)
              && this.checkConditions(config.conditions, sourceFiles[i], sourcePath, args)
        ) {

          var file = this.rewrite(config.rewrites, sourceFiles[i], sourcePath);

          tpls[ sourceFiles[i] ] = this.swigRender(
            path.join(config.target, file.replace(sourcePath, '/')),
            args
          );

        }

      }

    }

    return tpls;
  }

  this.writeTpls = function (tpls, args, force, callback) {

    var skelPath = this.skelPath;

    Object.keys(tpls).forEach(function (tpl) {

      var dist = tpls[tpl];
      var distDir = path.dirname(dist);

      if (fs.statSync(tpl).isFile()) {

        fs.mkdirsSync(distDir);
        fs.exists(process.cwd() + '/' + dist, function (exists) {

          if (!exists || force) {
            fs.writeFileSync(dist, self.swigRender(fs.readFileSync(tpl, 'utf-8'), args));
            console.log(( '+ ' + './' + dist).green);
          } else {
            console.log(( '! ' + './' + dist ).red);
          }

        });

      } else {
          this.writeDir(distDir, tpl, dist);
      }
    });

    if (callback && typeof( callback ) === "function") {

      callback(path.join(process.cwd(), args['name']), force);
    }

  };

  this.writeDir = function (distDir, tpl, dist) {

    fs.mkdirsSync(distDir);
    fs.copySync(tpl, dist);

    walk(dist).forEach(function (file) {

      file = path.join(dist, file);
      fs.writeFileSync(file, swig.render(fs.readFileSync(file, 'utf-8'), swig_result), 'utf-8');

    });
  };

  this.swigRender = function (content, args) {

    Object.keys(args).forEach(function (arg) {
      self.argsSwig[ arg.replace('-', '_') ] = args[arg];
    });

    var locals = { locals: this.argsSwig };

    return swig.render(content, locals);
  }

  this.checkIgnore = function (ignores, file, sourcePath) {

    file = file.replace(sourcePath + '/', '');

    for (var i in ignores) {

      var pattern = "^" + ignores[i].replace(/\//g, "\\/").replace(/\./g, "\\.") + ".*";
      var regex = RegExp(pattern);

      if (file.match(regex)) {
          return true;
      }

    }

    return false;

  }

  this.rewrite = function (rewrites, file, sourcePath) {

    file = file.replace(sourcePath + '/', '');

    if (rewrites.hasOwnProperty(file)) {
        return rewrites[ file ];
    } else {
        return file;
    }

  }

  this.checkConditions = function (conditions, file, sourcePath, args) {

    for (var i in conditions) {

      var condition = conditions[i];

      for (var j in condition.matches) {

        var pattern = "^" + sourcePath + "/" + condition.matches[j].replace(/\//g, "\\/").replace(/\./g, "\\.") + ".*";
        var regex = RegExp(pattern);
        if (file.match(regex)) {

          var rule = true;

          for (var j in condition.rules) {

            var rl = condition.rules[j];
            if (rl.value !== args[ rl.arg ]) {
              rule = false;
              break;
            }

          }
          return rule;
        }
      }
    }

    return true;
  }
}

function onErr(err) {
  console.log(err);
  return 1;
}

module.exports = exports = GraoGenerator;
