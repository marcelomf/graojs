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
      var schemaCapitalized = self.capitalize(result['schema']);
      var schemaPath = self.prepareSchemaPath(schemaCapitalized);
      fs.exists(path.join(process.cwd(), schemaPath), function (exists) {
        if (exists) {
          var resultSchemaFields = self.prepareSchemaFields(schemaCapitalized, self.prepareSchema(result['schema'], path.join(process.cwd(), schemaPath)).json);
          result['fields'] = resultSchemaFields.fields;
          result['hasUnion'] = resultSchemaFields.hasUnion;
          result['isSubDoc'] = resultSchemaFields.isSubDoc;
          result['hasSubDoc'] = resultSchemaFields.hasSubDoc;
          result['hasRef'] = resultSchemaFields.hasRef;
          //console.log(result);
          /** 
          * @FIXME
          * Dead code ?
          * result['jadeMacrosPath'] = path.join(generator.skelPath, "/view/jade/field_macros.jade");
          */
          generator.generate(result, force);
          fs.writeFileSync(path.join(process.cwd(), 'bundles/'+result['schema']+'/'+schemaCapitalized+'Schema.js'), 
            fs.readFileSync(path.join(process.cwd(), schemaPath), 'utf-8'), 'utf-8');
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
      if (err)
        return onErr(err);

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

  this.capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1);
  }

  this.prepareSchemaPath = function(schemaCapitalized) {
    return 'gen/' + schemaCapitalized + 'Schema.js';
  }

  this.prepareSchema = function (schema, schemaPath) {
    var validators = {};
    validators[schema] = true;
    var schemas = {};
    schemas[schema] = {};
    var diSchema = {
      mongoose: mongoose,
      validate: validate,
      validators: validators,
      schemas: schemas
    }
    return new (require(schemaPath))(diSchema);
  }

  this.prepareGenerator = function (type, argv) {
    // TODO accept --skeleton to override skeleton
    var skeleton = argv.hasOwnProperty('skeleton')
      ? argv.skeleton
      : null;
    generator.init(type, skeleton);
  }

  this.prepareSchemaFields = function (schemaName, schemaFields) {
    var result = { name: schemaName, hasUnion: false, isSubDoc: false, hasSubDoc: false, hasRef: false, fields: {} };
    var autoRefsFieldName = new Array();
    Object.keys(schemaFields).forEach(function (fieldName) {
      if (schemaFields[fieldName].graoui != undefined) {
        if(schemaFields[fieldName].graoui.type == 'union')
          result.hasUnion = true;
        result.fields[fieldName] = schemaFields[fieldName].graoui;
        result.fields[fieldName].isArray = false;
        if(schemaFields[fieldName].ref != null) {
          result.hasRef = true;
          result.fields[fieldName].ref = schemaFields[fieldName].ref;
          if(result.fields[fieldName].ref == result.name) {
            autoRefsFieldName.push(fieldName);
          } else {
            var schemaRef = self.prepareSchemaFields(schemaFields[fieldName].ref, self.prepareSchema(schemaFields[fieldName].ref, 
                                      path.join(process.cwd(), self.prepareSchemaPath(self.capitalize(schemaFields[fieldName].ref)))).json);
            for(var nameObj in schemaRef) {
              result.fields[fieldName][nameObj] = schemaRef[nameObj];
            }
          }
        }
      } else if (schemaFields[fieldName] instanceof Array && schemaFields[fieldName][0] != null && 
        (schemaFields[fieldName][0].graoui != undefined)) {
        if(schemaFields[fieldName][0].graoui.type == 'union')
          result.hasUnion = true;
        result.fields[fieldName] = schemaFields[fieldName][0].graoui;
        result.fields[fieldName].isArray = true;
        if(schemaFields[fieldName][0].ref != null) {
          result.hasRef = true;
          result.fields[fieldName].ref = schemaFields[fieldName][0].ref;
          if(result.fields[fieldName].ref == result.name) {
            autoRefsFieldName.push(fieldName);
          } else {
            var schemaRef = self.prepareSchemaFields(schemaFields[fieldName][0].ref, self.prepareSchema(schemaFields[fieldName][0].ref, 
                                        path.join(process.cwd(), self.prepareSchemaPath(self.capitalize(schemaFields[fieldName][0].ref)))).json);
            for(var nameObj in schemaRef) {
              result.fields[fieldName][nameObj] = schemaRef[nameObj];
            }
          } 
        }
      } else if(self.hasGraoui(schemaFields[fieldName]) || 
        (schemaFields[fieldName] instanceof Array && schemaFields[fieldName][0] != null && self.hasGraoui(schemaFields[fieldName][0]))) {
        result.fields[fieldName] = self.prepareSchemaFields(fieldName,(schemaFields[fieldName] instanceof Array) ? schemaFields[fieldName][0] : schemaFields[fieldName]);
        result.fields[fieldName].isSubDoc = true;
        if(schemaFields[fieldName] instanceof Array)
            result.fields[fieldName].isArray = true;
        else
            result.fields[fieldName].isArray = false;
        result.hasSubDoc = true;
      } 
    });
    if(autoRefsFieldName.length > 0) {
      for(var i in autoRefsFieldName) {
        for(var nameObj in result) {
          result.fields[autoRefsFieldName[i]][nameObj] = result[nameObj]; // Circular
        }
      }
    }
    return result;
  }

  this.hasGraoui = function (object) {
    for(var fieldName in object)
    {
      if(object[fieldName].graoui != undefined || 
        (object[fieldName][0] != null && object[fieldName][0].graoui != undefined))
        return true;
    }
    return false;
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