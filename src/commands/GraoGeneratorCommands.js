var path = require('path') ,
  fs = require('fs-extra'),
  prompt = require('prompt'),
  generator = require('../generator'),
  mongoose = require('mongoose'),
  validate = require('mongoose-validator').validate;

var walk = function (dir) {

  var results = []
  var list = fs.readdirSync(dir)

  list.forEach(function (file) {

    file = dir + '/' + file
    var stat = fs.statSync(file)
    if (stat && stat.isDirectory()) results = results.concat(walk(file))
    else results.push(file)
  });

  return results;
}

var GraoGeneratorCommands = function (di) {

  var self = this;

  this.id = 'generate';
  this.title = 'graoJS Generator commands';
  this.actions = [
    {
      id: 'app',
      method: 'runGenerateApp',
      desc: 'Generate a new graoJS Application',
      appOnly: false,
      promptSchema: {}
    },
    {
      id: 'bundle',
      method: 'runGenerateBundle',
      desc: 'Generate a new graoJS Bundle',
      appOnly: true,
      promptSchema: {}
    },
    {
      id: 'schemabundle',
      method: 'runGenerateSchemaBundle',
      desc: 'Generate a new graoJS Bundle based on a Schema',
      appOnly: true,
      promptSchema: {}
    },
    {
      id: 'schema',
      method: 'runGenerateSchema',
      desc: 'Generate a new graoJS Mongoose Schema',
      appOnly: true,
      promptSchema: {}
    }
  ];

  this.runGenerateApp = function (argv, prompt, schema) {

    this.prepareGenerator('app', argv);

    prompt.get(generator.config, function (err, result) {

      if (err) {
        return onErr(err);
      }

      var force = argv.hasOwnProperty('force')
        ? argv.force
        : false;

      generator.generate(result, force, self.copyGraoDeps(path.join(process.cwd(), result['name']), force));
    });

  }

  this.runGenerateBundle = function (argv, prompt, schema) {

    console.log('-- TODO runGenerateBundle');

  }

  this.runGenerateSchemaBundle = function (argv, prompt, schema) {

    this.prepareGenerator('schemabundle', argv);

    prompt.get(generator.config, function (err, result) {

      if (err) {
        return onErr(err);
      }

      var force = argv.hasOwnProperty('force')
        ? argv.force
        : false;

      var schemaCapitalized = result['schema'].charAt(0).toUpperCase() + result['schema'].substring(1).toLowerCase();

      var schemaPath = 'bundles/' + result['schema'] + '/' + schemaCapitalized + 'Schema.js';

      fs.exists(path.join(process.cwd(), schemaPath), function (exists) {

        if (exists) {

          var schemaFields = self.prepareSchemaFields(result['schema'], path.join(process.cwd(), schemaPath));

          result['fields'] = schemaFields;
          result['jadeMacrosPath'] = path.join(generator.skelPath, "/view/jade/field_macros.jade");

          generator.generate(result, force);

        } else {
          console.log(( 'ERROR: ' + schemaPath + ' doesn\'t exist. Aborting').red);
          return false;
        }

      });

    });

  }

  this.runGenerateSchema = function (argv, prompt, schema) {

    this.prepareGenerator('schema', argv);

    prompt.get(generator.config, function (err, result) {

      if (err) {
        return onErr(err);
      }

      var force = argv.hasOwnProperty('force')
        ? argv.force
        : false;

      generator.generate(result, force, function () {
        console.log(
          "Edit the schema and add your fields" +
          "\nthen run " + "grao generate:schemabundle".blue +
          " to generate a CRUD bundle for your schema \n"
        )
      });

    });

  }

  this.prepareGenerator = function (type, argv) {

    // TODO accept --skeleton to override skeleton
    var skeleton = argv.hasOwnProperty('skeleton')
      ? argv.skeleton
      : null;

    generator.init(type, skeleton);

  }

  this.prepareSchemaFields = function (schema, schemaPath) {

    var validators = {};
    validators[schema] = true;

    var diSchema = {
      mongoose: mongoose,
      validate: validate,
      validators: validators
    }

    var modelSchema = new (require(schemaPath))(diSchema);

    var fields = {};

    Object.keys(modelSchema.json).forEach(function (fieldName) {

      if (modelSchema.json[fieldName].graoui != undefined) {
        fields[fieldName] = modelSchema.json[fieldName].graoui;
      }

    });

    return fields;

  }

  this.copyGraoDeps = function (appPath, force) {
    if(!fs.existsSync(appPath))
      fs.mkdirSync(appPath, 0755);

    if(!fs.existsSync(appPath+"/node_modules"))
      fs.mkdirSync(appPath+"/node_modules", 0755);

    if(!fs.existsSync(appPath+"/node_modules/graojs") || force)
      fs.copy(__dirname+"/../..", appPath+"/node_modules/graojs");
  }

}

function onErr(err) {
  console.log(err);
  return 1;
}

module.exports = exports = GraoGeneratorCommands;
