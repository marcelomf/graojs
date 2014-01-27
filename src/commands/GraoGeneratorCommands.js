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
          var uiSchema = self.prepareSchemaUi(schemaCapitalized, self.prepareSchema(result['schema'], path.join(process.cwd(), schemaPath)));
          for(var uiName in uiSchema)
          {
            result[uiName] = uiSchema[uiName];
          }
          console.log(result);
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

  this.prepareSchemaUi = function (schemaName, schemaObj) {
    var rootGraoui = (schemaObj.graoui != null) ? schemaObj.graoui : {};
    var resultUi;
    var autoRefsFieldName = new Array();

    function prepareFields(jsonFields){
      var result = {  name: schemaName, 
                    label: (rootGraoui.label != null) ? rootGraoui.label : schemaName, 
                    description: (rootGraoui.description != null) ? rootGraoui.description : schemaName, 
                    refLabel: (rootGraoui.refLabel != null) ? rootGraoui.refLabel : null, 
                    hasUnion: false, 
                    isSubDoc: false, 
                    hasSubDoc: false, 
                    hasRef: false, 
                    fields: {} 
      };
      for(var fieldName in jsonFields) {
        if (jsonFields[fieldName].graoui != undefined) {
          if(jsonFields[fieldName].graoui.type == 'union')
            result.hasUnion = true;
          result.fields[fieldName] = jsonFields[fieldName].graoui;
          result.fields[fieldName].isArray = false;
          if(jsonFields[fieldName].ref != null) {
            result.hasRef = true;
            result.fields[fieldName].ref = jsonFields[fieldName].ref;
            if(result.fields[fieldName].ref == result.name) {
              autoRefsFieldName.push(fieldName);
            } else {
              var schemaRef = self.prepareSchemaUi(jsonFields[fieldName].ref, self.prepareSchema(jsonFields[fieldName].ref, 
                                        path.join(process.cwd(), self.prepareSchemaPath(self.capitalize(jsonFields[fieldName].ref)))));
              for(var nameObj in schemaRef) {
                result.fields[fieldName][nameObj] = schemaRef[nameObj];
              }
            }
          }
        } else if (jsonFields[fieldName] instanceof Array && jsonFields[fieldName][0] != null && 
          (jsonFields[fieldName][0].graoui != undefined)) {
          if(jsonFields[fieldName][0].graoui.type == 'union')
            result.hasUnion = true;
          result.fields[fieldName] = jsonFields[fieldName][0].graoui;
          result.fields[fieldName].isArray = true;
          if(jsonFields[fieldName][0].ref != null) {
            result.hasRef = true;
            result.fields[fieldName].ref = jsonFields[fieldName][0].ref;
            if(result.fields[fieldName].ref == result.name) {
              autoRefsFieldName.push(fieldName);
            } else {
              var schemaRef = self.prepareSchemaUi(jsonFields[fieldName][0].ref, self.prepareSchema(jsonFields[fieldName][0].ref, 
                                          path.join(process.cwd(), self.prepareSchemaPath(self.capitalize(jsonFields[fieldName][0].ref)))));
              for(var nameObj in schemaRef) {
                result.fields[fieldName][nameObj] = schemaRef[nameObj];
              }
            } 
          }
        } else if(self.hasGraoui(jsonFields[fieldName]) || 
          (jsonFields[fieldName] instanceof Array && 
            jsonFields[fieldName][0] != null && 
            self.hasGraoui(jsonFields[fieldName][0]))) {
          result.fields[fieldName] = {};
          result.fields[fieldName].fields = prepareFields((jsonFields[fieldName] instanceof Array) ? 
                                              jsonFields[fieldName][0] : 
                                              jsonFields[fieldName]).fields;
          result.fields[fieldName].isSubDoc = true;
          if(jsonFields[fieldName] instanceof Array)
              result.fields[fieldName].isArray = true;
          else
              result.fields[fieldName].isArray = false;
          result.hasSubDoc = true;
        } 
      }
      return result;
    }

    resultUi = prepareFields(schemaObj.json);

    if(autoRefsFieldName.length > 0) {
      for(var i in autoRefsFieldName) {
        for(var nameObj in resultUi) {
          resultUi.fields[autoRefsFieldName[i]][nameObj] = resultUi[nameObj]; // Circular
        }
      }
    }
    return resultUi;
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