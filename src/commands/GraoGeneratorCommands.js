var path = require('path') ,
  fs = require('fs-extra'),
  prompt = require('prompt'),
  generator = require(path.join("..", "generator")),
  mongoose = require('mongoose'),
  validate = require('mongoose-validator').validate;

var walk = function (dir) {
  var results = []
  var list = fs.readdirSync(dir)
  list.forEach(function (file) {
    file = dir + path.sep + file
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
  };

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

      for(var i in schemas) {
        var varsGenerate = {};
        /* @FIXME BUG when generateBundle with divergent schemas of different bundles */
        varsGenerate['allSchemas'] = schemas;
        varsGenerate['schema'] = schemas[i];
        var schemaName = varsGenerate['schema'];
        var schemaPath = self.prepareSchemaPath(schemaName);
        var fullSchemaPath = path.join(process.cwd(), schemaPath);
        //console.log(fullSchemaPath);
        if(fs.existsSync(fullSchemaPath)){
          //console.log(require(fullSchemaPath));
          //process.exit();
          var uiSchema = self.prepareSchemaUi(schemaName, require(fullSchemaPath));
          for(var uiName in uiSchema) {
            varsGenerate[uiName] = uiSchema[uiName];
          }
          varsGenerate = self.preparePaths(varsGenerate);
          varsGenerate = self.prepareRefFields(varsGenerate);         
          if(!fs.existsSync(path.join("bundles", varsGenerate['bundle'])))
            fs.mkdirSync(path.join("bundles", varsGenerate['bundle']), 0755);
          generator.generate(varsGenerate, force);
          fs.writeFileSync(path.join(process.cwd(), 'bundles', varsGenerate['bundle'], schemaName+'.json'), 
            fs.readFileSync(fullSchemaPath, 'utf-8'), 'utf-8');
        } else {
          console.log(( 'ERROR: ' + fullSchemaPath + ' doesn\'t exist. Aborting this file').red);
        }
      }
    });
  }

  this.prepareSchemaUi = function(schemaName, schemaObj, schemaRoot) {
    var rootGraoui = {};
    var resultUi;
    var autoRefsFieldName = new Array();
    var allRefs = new Array();
    var allRefsFieldName = new Array();

    function prepareFields(fields){
      var result = {  name: schemaName, 
                    bundle: (schemaObj.bundle != null) ? schemaObj.bundle : schemaName.toLowerCase(), 
                    label: (schemaObj.label != null) ? schemaObj.label : schemaName, 
                    description: (schemaObj.description != null) ? schemaObj.description : schemaName, 
                    refLabel: (schemaObj.refLabel != null) ? schemaObj.refLabel : null, 
                    hasUnion: false, 
                    isSubDoc: false, 
                    hasSubDoc: false, 
                    hasRef: false, 
                    fields: {} 
      };
      for(var fieldName in fields) {
        // Verify if is subDoc of array type
        if (fields[fieldName] instanceof Array && 
                (fields[fieldName][0].label === undefined || 
                fields[fieldName][0].type === undefined)) {
          result.fields[fieldName] = {};
          result.fields[fieldName].fields = prepareFields((fields[fieldName] instanceof Array) ? 
                                              fields[fieldName][0] : 
                                              fields[fieldName]).fields;
          result.fields[fieldName].isSubDoc = true;
          if(fields[fieldName] instanceof Array)
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
        // Possible array of ref tpye  
        } else if (fields[fieldName] instanceof Array && fields[fieldName][0] != null) {
          if(fields[fieldName][0].type == 'union')
            result.hasUnion = true;
          result.fields[fieldName] = fields[fieldName][0];
          result.fields[fieldName].isArray = true;
          if(fields[fieldName][0].ref != null) {
            self.pushRefField(result, schemaRoot, schemaName, allRefsFieldName, allRefs, autoRefsFieldName,
                                fieldName, result.fields[fieldName], fields[fieldName][0]);
          }
        } else {
          if(fields[fieldName].type == 'union')
            result.hasUnion = true;
          result.fields[fieldName] = fields[fieldName];
          result.fields[fieldName].isArray = false;
          if(fields[fieldName].ref != null) {
            self.pushRefField(result, schemaRoot, schemaName, allRefsFieldName, allRefs, autoRefsFieldName,
                                fieldName, result.fields[fieldName], fields[fieldName]);
          }          
        } 
      }
      return result;
    }

    //console.log(schemaObj.fields);
    //process.exit();

    resultUi = prepareFields(schemaObj.fields);
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

  this.prepareRefFields = function(resultUi, fields, fullPath) {
    if(!fields)
      fields = resultUi.fields;

    if(!resultUi['allRefsBundle'])
      resultUi['allRefsBundle'] = {};

    for(var fieldName in fields) {
      if(fields[fieldName].ref){
        if(!fields[fieldName].bundle) {
           var fullSchemaPath = path.join(process.cwd(), self.prepareSchemaPath(fields[fieldName].ref));
           var schemaRefObj = require(fullSchemaPath);  
           if(schemaRefObj.bundle != null) {
            fields[fieldName].bundle = schemaRefObj.bundle;
            resultUi['allRefsBundle'][fields[fieldName].ref] = schemaRefObj.bundle;
           } else {
            fields[fieldName].bundle = fields[fieldName].ref.toLowerCase();
            resultUi['allRefsBundle'][fields[fieldName].ref] = schemaRefObj.bundle;
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

  this.pushRefField = function(result, schemaRoot, schemaName, allRefsFieldName, allRefs, autoRefsFieldName, fieldName, refField, field) {
    //console.log(schemaRoot,schemaName,fieldName);
    result.hasRef = true;
    refField.ref = field.ref;
    allRefs.push(refField.ref);
    allRefsFieldName.push(fieldName);
    if(refField.ref == result.name || refField.ref == schemaRoot) {
      autoRefsFieldName.push(fieldName);
    } else {
      var fullSchemaPath = path.join(process.cwd(), self.prepareSchemaPath(refField.ref));
      var schemaRef = self.prepareSchemaUi(field.ref, require(fullSchemaPath), schemaName);
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

  this.preparePaths = function(resultUi, fields, fullPath) {
    if(!fields)
      fields = resultUi.fields;

    for(var fieldName in fields) {
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

  this.prepareSchemaPath = function(schemaName) {
    return 'gen/' + schemaName + '.json';
  }

  this.prepareGenerator = function (type, argv) {
    // TODO accept --skeleton to override skeleton
    var skeleton = argv.hasOwnProperty('skeleton')
      ? argv.skeleton
      : null;
    generator.init(type, skeleton);
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

    if(!fs.existsSync(path.join(appPath, "node_modules")))
      fs.mkdirSync(path.join(appPath, "node_modules"), 0755);

    if(!fs.existsSync(path.join(appPath, "node_modules", "graojs")) || force)
      fs.copySync(path.join(__dirname, "..", ".."), path.join(appPath, "node_modules", "graojs"));

    if(!fs.existsSync(path.join(appPath,"node_modules", "passport-local")) || force)
      fs.copySync(path.join(__dirname, "..", "..", "node_modules", "passport-local"), path.join(appPath, "node_modules", "passport-local"));
    
    if(!fs.existsSync(path.join(appPath,"node_modules", "passport-strategy")) || force)
      fs.copySync(path.join(__dirname, "..", "..", "node_modules", "passport-strategy"), path.join(appPath, "node_modules", "passport-strategy"));

  }
}

function onErr(err) {
  console.log(err);
  return 1;
}

module.exports = exports = GraoGeneratorCommands;