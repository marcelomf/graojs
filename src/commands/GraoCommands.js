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

}

function onErr(err) {
  console.log(err);
  return 1;
}

module.exports = exports = GraoCommands;