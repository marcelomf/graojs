var
  path = require('path'),
  fs = require('fs-extra');

var GraoCommands = function (di) {

  this.id = 'main';
  this.title = 'Main graoJS commands';
  this.actions = [
    {
      id: 'version',
      method: 'runVersion',
      desc: 'Shows graoJS version',
      appOnly: false,
      promptSchema: {}
    },
    {
      id: 'asciiart',
      method: 'runAsciiart',
      desc: 'Shows graoJS logo on ASCII Art',
      appOnly: false,
      promptSchema: {}
    },
    {
      id: 'hello:world',
      method: 'runHelloWorld',
      desc: 'Sample hello world command',
      appOnly: false,
      promptSchema: {
        properties: {
          name: {
            description: "Your Name ( only letters )",
            pattern: "^[a-zA-Z]+$",
            message: "Must be only letters",
            required: true
          }
        }
      }
    },
    {
      id: 'create:admin',
      method: 'createAdmin',
      desc: 'Create admin user',
      appOnly: true,
      promptSchema: {
        properties: {
          username: {
            description: "Username must be only lowercase letters or numbers",
            pattern: "^[a-z0-9]+$",
            message: "Username must be only lowercase letters or numbers",
            required: true
          },
          email: {
            description: "Valid email it's necessary",
            pattern: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
            message: "Valid email it's necessary",
            required: true
          },
          password: {
            message: "Password it's required",
            required: true,
            hidden: true
          }
        }
      }
    }
  ];

  this.runVersion = function (argv, prompt, schema) {

    var package = JSON.parse(fs.readFileSync(path.join(__dirname, '/../..', 'package.json'), 'utf8').toString().replace(/\n/g, ''));
    console.log('>> ' + package.version);

  }

  this.runAsciiart = function (argv, prompt, schema) {

    console.log("\n" + fs.readFileSync(path.join(__dirname, '/../..', 'graojs.ascii'), { encoding: 'utf8' }));

  }

  this.runHelloWorld = function (argv, prompt, schema) {

    prompt.get(schema, function doPrompt(err, result) {

      if (err) {
        return onErr(err);
      }
      console.log('Hello, ' + result.name);

    });

  }

  this.createAdmin = function(argv, prompt, schema) {

    var GraoJS = require("graojs");
    var grao = new GraoJS();

    prompt.get(schema, function (err, args) {
      if (err)
        return exit((err).red);
      
      function saveUser(activity) {
        if(!activity || !activity._id) {
          console.log(activity);
          return exit(("Activity id not found!").red);
        }
        var user = new grao.kernel.models.user;
        user.name = args.username;
        user.username = args.username;
        user.password = args.password;
        user.email = args.email;
        user.activitys = new Array();
        user.activitys.push(activity._id);
        user.enabled = true;
        user.save(function(err, user){
          if(err || !user) return exit((err.message ? err.message : err).red);
          exit(("Admin user created successfully").blue);
        });
      }

      grao.kernel.models.activity.findOne({code: "admin"}, function(err, activity){
        if(err || !activity){
          var activity = new grao.kernel.models.activity;
          activity.name = "Administrative";
          activity.code = "admin";
          activity.description = "Auto-generate by graoJS CLI";
          activity.save(function(err, activity){
            if(err || !activity) return exit((err.message ? err.message : err).red);
            console.log(("Admin activity created successfully").blue);
            saveUser(activity);
          });
        } else {
          saveUser(activity);
        }
      });
    });

    function exit(msg) {
      console.log(msg);
      delete grao;
      delete GraoJS;
      process.exit(0);
    }

  }

}

function onErr(err) {
  console.log(err);
  return 1;
}

module.exports = exports = GraoCommands;
