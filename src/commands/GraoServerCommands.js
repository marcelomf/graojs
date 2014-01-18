var GraoServerCommands = function (di) {

  this.di = di;

  this.id = 'server';
  this.title = 'graoJS Server commands';
  this.actions = [
    {
      id: 'run:dev',
      method: 'runRunDev',
      desc: 'Run server on DEV environment (with node-supervisor)',
      appOnly: true,
      promptSchema: {}
    },
    {
      id: 'run:prod',
      method: 'runRunProd',
      desc: 'Run server on PROD environment (with node-forever)',
      appOnly: true,
      promptSchema: {}
    },
    {
      id: 'dump:nginx',
      method: 'runDumpNginx',
      desc: 'Dump Nginx configuration',
      appOnly: true,
      promptSchema: {}
    },
    {
      id: 'dump:apache2',
      method: 'runDumpApache2',
      desc: 'Dump Apache2 configuration',
      appOnly: true,
      promptSchema: {}
    }
  ];

  this.runRunDev = function (argv, prompt, schema) {

    console.log('Running Development Server');
    var args = [
      '-e',
      'js|jade|swig|css|less|jpg|png|gif',
      'index.js'
    ];
    require('supervisor').run(args);

  }

  this.runRunProd = function (argv, prompt, schema) {

    console.log('Running PRODUCTION Server');

    var forever = require('forever');

    var child = new (forever.Monitor)(process.cwd() + '/index.js', {
      max: 100,
      silent: true,
      LOGFILE: process.cwd() + 'log/grao.log',
      options: []
    });

    child.on('exit', function(){
      console.log('Application ended after 100 restarts')
    });
    child.start();

  }

  // TODO
  this.runDumpNginx = function (argv, prompt, schema) {

    console.log('TODO runDumpNginx');

  }

  // TODO
  this.runDumpApache2 = function (argv, prompt, schema) {

    console.log('TODO runDumpApache2');

  }

}

function onErr(err) {
    console.log(err);
    return 1;
}

module.exports = exports = GraoServerCommands;