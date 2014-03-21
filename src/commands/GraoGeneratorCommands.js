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
        //console.log(fullSchemaPath);
        if(fs.existsSync(fullSchemaPath)){
          var uiSchema = self.prepareSchemaUi(schemaCapitalized, self.prepareSchema(varsGenerate['schema'], fullSchemaPath));
          for(var uiName in uiSchema) {
            varsGenerate[uiName] = uiSchema[uiName];
          }
          varsGenerate = self.preparePaths(varsGenerate);
          varsGenerate = self.prepareRefFields(varsGenerate);         
          if(varsGenerate.fields.provider) {
            //console.log(varsGenerate.fields.individual);
            //console.log(varsGenerate.fields.provider);
            //process.exit(1);
          }
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

    if(!resultUi['allRefsBundle'])
      resultUi['allRefsBundle'] = {};

    for(fieldName in fields) {
      if(fields[fieldName].ref){
        if(!fields[fieldName].bundle) {
           var schemaRefObj = self.prepareSchema(fields[fieldName].ref, 
            path.join(process.cwd(), self.prepareSchemaPath(self.capitalize(fields[fieldName].ref))));
           if(schemaRefObj.graoui != null && schemaRefObj.graoui.bundle != null) {
            fields[fieldName].bundle = schemaRefObj.graoui.bundle;
            resultUi['allRefsBundle'][fields[fieldName].ref] = schemaRefObj.graoui.bundle;
           } else {
            fields[fieldName].bundle = fields[fieldName].ref.toLowerCase();
            resultUi['allRefsBundle'][fields[fieldName].ref] = schemaRefObj.graoui.bundle;
           }
        } else {
          resultUi['allRefsBundle'][fields[fieldName].ref] = fields[fieldName].bundle;
        }
      }
      if(fields[fieldName].fields){
        this.prepareRefFields(resultUi, fields[fieldName].fields, {normal: fields[fieldName].fullPath, 
                                                                    cc: fields[fieldName].fullPathCc });

      }
    }
    resultUi['isAutoRefered'] = false;
    for(var i in resultUi['allRefs']) {
      if(resultUi['allRefs'][i].toLowerCase() == resultUi.schema.toLowerCase()) {
        resultUi['isAutoRefered'] = true;
        break;
      }
    }
    return resultUi;
  }

  this.preparePaths = function(resultUi, fields, fullPath) {
    if(!fields)
      fields = resultUi.fields;

    for(fieldName in fields) {
      if(fullPath) {
        fields[fieldName].fullPath = fullPath.normal+'.'+fieldName;
        fields[fieldName].fullPathCc = fullPath.cc+self.capitalize(fieldName);
      } else {
        fields[fieldName].fullPath = resultUi.schema+'.'+fieldName;
        fields[fieldName].fullPathCc = resultUi.schema+self.capitalize(fieldName);
      }
      if(fields[fieldName].fields){
        this.preparePaths(resultUi, fields[fieldName].fields, {normal: fields[fieldName].fullPath, 
                                                                    cc: fields[fieldName].fullPathCc });
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

  this.pushRefField = function(result, schemaRoot, schemaName, allRefsFieldName, allRefs, autoRefsFieldName, fieldName, refField, jsonField) {
    //console.log(schemaRoot,schemaName,fieldName);
    result.hasRef = true;
    refField.ref = jsonField.ref;
    allRefs.push(refField.ref);
    allRefsFieldName.push(fieldName);
    if(refField.ref == result.name || refField.ref == schemaRoot) {
      autoRefsFieldName.push(fieldName);
    } else {
      var schemaRef = self.prepareSchemaUi(jsonField.ref, self.prepareSchema(jsonField.ref, 
                                path.join(process.cwd(), self.prepareSchemaPath(self.capitalize(jsonField.ref)))), schemaName);
      for(var i in schemaRef.allRefs) {
        allRefs.push(schemaRef.allRefs[i]);
      }
      for(var i in schemaRef.allRefsFieldName) {
        allRefsFieldName.push(schemaRef.allRefsFieldName[i]);
      }
      for(var nameObj in schemaRef) {
        if(nameObj == "label" && refField[nameObj]) // label bypass
          continue;

        refField[nameObj] = schemaRef[nameObj];
      }
    }
    return result;
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
          /*result.fields[fieldName].fullPath = schemaName.toLowerCase()+'.'+fieldName;
          result.fields[fieldName].fullPathCc = schemaName.toLowerCase()+self.capitalize(fieldName);*/
          result.fields[fieldName].isArray = false;
          if(jsonFields[fieldName].ref != null) {
            self.pushRefField(result, schemaRoot, schemaName, allRefsFieldName, allRefs, autoRefsFieldName,
                                fieldName, result.fields[fieldName], jsonFields[fieldName]);
          }
        } else if (jsonFields[fieldName] instanceof Array && jsonFields[fieldName][0] != null && 
          (jsonFields[fieldName][0].graoui != undefined)) {
          if(jsonFields[fieldName][0].graoui.type == 'union')
            result.hasUnion = true;
          result.fields[fieldName] = jsonFields[fieldName][0].graoui;
          /*result.fields[fieldName].fullPath = schemaName.toLowerCase()+'.'+fieldName;
          result.fields[fieldName].fullPathCc = schemaName.toLowerCase()+self.capitalize(fieldName);*/
          result.fields[fieldName].isArray = true;
          if(jsonFields[fieldName][0].ref != null) {
            self.pushRefField(result, schemaRoot, schemaName, allRefsFieldName, allRefs, autoRefsFieldName,
                                fieldName, result.fields[fieldName], jsonFields[fieldName][0]);
          }
        } else if(self.hasGraoui(jsonFields[fieldName]) || 
          (jsonFields[fieldName] instanceof Array && 
            jsonFields[fieldName][0] != null && 
            self.hasGraoui(jsonFields[fieldName][0]))) {
          result.fields[fieldName] = {};
          /*result.fields[fieldName].fullPath = schemaName.toLowerCase()+'.'+fieldName;
          result.fields[fieldName].fullPathCc = schemaName.toLowerCase()+self.capitalize(fieldName);*/
          result.fields[fieldName].fields = prepareFields((jsonFields[fieldName] instanceof Array) ? 
                                              jsonFields[fieldName][0] : 
                                              jsonFields[fieldName]).fields;
          result.fields[fieldName].isSubDoc = true;
          if(jsonFields[fieldName] instanceof Array)
              result.fields[fieldName].isArray = true;
          else
              result.fields[fieldName].isArray = false;
          result.hasSubDoc = true;
          if(self.hasSubDoc(result.fields[fieldName].fields)){
            result.fields[fieldName].hasSubDoc = true;
          }
          if(self.hasRef(result.fields[fieldName].fields)) {
            result.hasRef = true;
            result.fields[fieldName].hasRef = true;
          }
        } 
      }
      return result;
    }

    resultUi = prepareFields(schemaObj.json);
    resultUi.allRefs = allRefs;
    resultUi.allRefsFieldName = allRefsFieldName;

    if(autoRefsFieldName.length > 0) {
      for(var i in autoRefsFieldName) {
        if(resultUi.fields[autoRefsFieldName[i]] != null){
          resultUi.fields[autoRefsFieldName[i]].refLabel = resultUi.refLabel;
        }
      }
      autoRefsFieldName = new Array();
    }
    return resultUi;
  }

  this.hasSubDoc = function (object) {
    for(var fieldName in object)
    {
      if(object[fieldName].isSubDoc == true ||  object[fieldName].hasSubDoc == true || 
        (object[fieldName][0] != null && (object[fieldName][0].isSubDoc == true || object[fieldName][0].hasSubDoc == true)))
        return true;
    }
    return false;
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

  this.hasRef = function (object) {
    for(var fieldName in object)
    {
      if(object[fieldName].ref != undefined || 
        (object[fieldName][0] != null && object[fieldName][0].ref != undefined))
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