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
    this.prepareGenerator('bundle', argv);
    prompt.get(generator.config, function (err, options) {
      if (err)
        return onErr(err);
      var force = argv.hasOwnProperty('force') ? argv.force : false;
      var schemas = new Array();
      if(options['schemas'].indexOf(','))
        schemas = options['schemas'].split(',');
      else
        schemas.push(options['schemas']);

      for(i in schemas) {
        var varsGenerate = {};
        /* @FIXME BUG when generateBundle with divergent schemas of different bundles */
        varsGenerate['allSchemas'] = schemas;
        varsGenerate['schema'] = schemas[i];
        var schemaCapitalized = self.capitalize(varsGenerate['schema']);
        var schemaPath = self.prepareSchemaPath(schemaCapitalized);
        var fullSchemaPath = path.join(process.cwd(), schemaPath);
        console.log(fullSchemaPath);
        if(fs.existsSync(fullSchemaPath)){
          var uiSchema = self.prepareSchemaUi(schemaCapitalized, self.prepareSchema(varsGenerate['schema'], fullSchemaPath));
          for(var uiName in uiSchema) {
            varsGenerate[uiName] = uiSchema[uiName];
          }
          varsGenerate = self.prepareRefFields(varsGenerate);
          varsGenerate = self.prepareSubDocFields(varsGenerate);
          console.log(varsGenerate);
          if(!fs.existsSync("bundles/"+varsGenerate['bundle']))
            fs.mkdirSync("bundles/"+varsGenerate['bundle'], 0755);
          generator.generate(varsGenerate, force);
          fs.writeFileSync(path.join(process.cwd(), 'bundles/'+varsGenerate['bundle']+'/'+schemaCapitalized+'Schema.js'), 
            fs.readFileSync(fullSchemaPath, 'utf-8'), 'utf-8');
        } else {
          console.log(( 'ERROR: ' + fullSchemaPath + ' doesn\'t exist. Aborting this file').red);
        }
      }
    });
  }

  this.prepareRefFields = function(resultUi, fields, fullPath) {
    if(!fields)
      fields = resultUi.fields;

    if(!resultUi['allRefFields'])
      resultUi['allRefFields'] = {};

    for(fieldName in fields) {
      //if(fields[fieldName].ref && !resultUi['allRefFields'][fieldName]){
      if(fields[fieldName].ref){
        if(!fields[fieldName].bundle) {
           var schemaRefObj = self.prepareSchema(fields[fieldName].ref, 
            path.join(process.cwd(), self.prepareSchemaPath(self.capitalize(fields[fieldName].ref))));
           if(schemaRefObj.graoui != null && schemaRefObj.graoui.bundle != null)
            fields[fieldName].bundle = schemaRefObj.graoui.bundle;
           else
            fields[fieldName].bundle = fields[fieldName].ref.toLowerCase();
        }
        resultUi['allRefFields'][fieldName] = fields[fieldName];
        if(fullPath) {
          resultUi['allRefFields'][fieldName]['fullPath'] = fullPath.normal+'.'+fieldName;
          resultUi['allRefFields'][fieldName]['fullPathCc'] = fullPath.cc+self.capitalize(fieldName);
        } else {
          resultUi['allRefFields'][fieldName]['fullPath'] = resultUi.schema+'.'+fieldName;
          resultUi['allRefFields'][fieldName]['fullPathCc'] = resultUi.schema+self.capitalize(fieldName);
        }
      }
      if(fields[fieldName].hasRef && fields[fieldName].fields){
        this.prepareRefFields(resultUi, fields[fieldName].fields, {normal: resultUi['allRefFields'][fieldName]['fullPath'], 
                                                                    cc: resultUi['allRefFields'][fieldName]['fullPathCc'] });
      }
    }
    return resultUi;
  }

  this.prepareSubDocFields = function(resultUi, fields, fullPath) {
    if(!fields)
      fields = resultUi.fields;

    if(!resultUi['allSubDocFields'])
      resultUi['allSubDocFields'] = {};

    for(fieldName in fields) {
      if(fields[fieldName].isSubDoc){
        resultUi['allSubDocFields'][fieldName] = fields[fieldName];
        if(fullPath) {
          resultUi['allSubDocFields'][fieldName]['fullPath'] = fullPath.normal+'.'+fieldName;
          resultUi['allSubDocFields'][fieldName]['fullPathCc'] = fullPath.cc+self.capitalize(fieldName);
        } else {
          resultUi['allSubDocFields'][fieldName]['fullPath'] = resultUi.schema+'.'+fieldName;
          resultUi['allSubDocFields'][fieldName]['fullPathCc'] = resultUi.schema+self.capitalize(fieldName);
        }
      }
      if(fields[fieldName].hasSubDoc){
        this.prepareSubDocFields(resultUi, fields[fieldName].fields, {normal: resultUi['allRefFields'][fieldName]['fullPath'], 
                                                                    cc: resultUi['allRefFields'][fieldName]['fullPathCc'] });
      }
    }
    return resultUi;
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

  this.prepareSchemaUi = function (schemaName, schemaObj, schemaRoot) {
    var rootGraoui = (schemaObj.graoui != null) ? schemaObj.graoui : {};
    var resultUi;
    var autoRefsFieldName = new Array();
    var allRefs = new Array();
    var allRefsFieldName = new Array();

    function prepareFields(jsonFields){
      var result = {  name: schemaName, 
                    bundle: (rootGraoui.bundle != null) ? rootGraoui.bundle : schemaName.toLowerCase(), 
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
            allRefs.push(result.fields[fieldName].ref);
            allRefsFieldName.push(fieldName);
            if(result.fields[fieldName].ref == result.name || result.fields[fieldName].ref == schemaRoot) {
              autoRefsFieldName.push(fieldName);
            } else {
              var schemaRef = self.prepareSchemaUi(jsonFields[fieldName].ref, self.prepareSchema(jsonFields[fieldName].ref, 
                                        path.join(process.cwd(), self.prepareSchemaPath(self.capitalize(jsonFields[fieldName].ref)))), schemaName);
              for(var i in schemaRef.allRefs) {
                allRefs.push(schemaRef.allRefs[i]);
              }
              for(var i in schemaRef.allRefsFieldName) {
                allRefsFieldName.push(schemaRef.allRefsFieldName[i]);
              }
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
            allRefs.push(result.fields[fieldName].ref);
            allRefsFieldName.push(fieldName);
            if(result.fields[fieldName].ref == result.name || result.fields[fieldName].ref == schemaRoot) {
              autoRefsFieldName.push(fieldName);
            } else {
              var schemaRef = self.prepareSchemaUi(jsonFields[fieldName][0].ref, self.prepareSchema(jsonFields[fieldName][0].ref, 
                                          path.join(process.cwd(), self.prepareSchemaPath(self.capitalize(jsonFields[fieldName][0].ref)))), schemaName);
              for(var i in schemaRef.allRefs) {
                allRefs.push(schemaRef.allRefs[i]);
              }
              for(var i in schemaRef.allRefsFieldName) {
                allRefsFieldName.push(schemaRef.allRefsFieldName[i]);
              }
              for(var nameObj in schemaRef) {
                result.fields[fieldName][nameObj] = schemaRef[nameObj];
              }
            };  
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
    resultUi.allRefs = allRefs;
    resultUi.allRefsFieldName = allRefsFieldName;

    if(autoRefsFieldName.length > 0) {
      for(var i in autoRefsFieldName) {
        for(var nameObj in resultUi) {
          if(resultUi.fields[autoRefsFieldName[i]] != null && resultUi.fields[autoRefsFieldName[i]][nameObj] != null)
            resultUi.fields[autoRefsFieldName[i]][nameObj] = resultUi[nameObj]; // Circular
        }
      }
      autoRefsFieldName = new Array();
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

    if(!fs.existsSync(appPath+"/node_modules/passport-local") || force)
      fs.copy(__dirname+"/../../node_modules/passport-local", appPath+"/node_modules/passport-local");
  }
}

function onErr(err) {
  console.log(err);
  return 1;
}

module.exports = exports = GraoGeneratorCommands;