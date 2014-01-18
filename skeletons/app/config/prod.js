var fs = require('fs'),
  path = require('path'),
  rootPath = path.normalize(__dirname) + '/..',
  charset = 'utf-8',
  packageJson = JSON.parse(fs.readFileSync(rootPath+'/package.json', charset));

module.exports = exports = {
  packageJson: packageJson,
  ports : [{{server_ports}}],
  charset: charset,
    db: 'mongodb://{{mongodb_host}}/{{mongodb_db}}',
    rootPath: rootPath,
    bundles: rootPath + '/bundles',
    vendor: rootPath + '/vendor',
    locales: rootPath + '/config/locales',
    name : packageJson.description,
    template_engine : '{{ template_engine }}',
    log : {
    transport : {
      console : {
        colorize: true,
          json : false,
          timestamp : true,
          level : 'info'
      },
      file : {
        filename : rootPath + '/log/grao.log',
          json : false,
          level : 'error'
      }
    },
    exception : {
      console : {
        colorize: true,
          json : false,
          timestamp : true,
          level : 'info'
      },
      file : {
        filename : rootPath + '/log/grao.log',
          json : false,
          level : 'error'
      }
    },
  },
  facebook : {
    clientID : "APP_ID",
      clientSecret : "APP_SECRET",
      callbackURL : "http://localhost:3000/auth/facebook/callback"
  },
  twitter : {
    clientID : "CONSUMER_KEY",
      clientSecret : "CONSUMER_SECRET",
      callbackURL : "http://localhost:3000/auth/twitter/callback"
  },
  github : {
    clientID : 'APP_ID',
      clientSecret : 'APP_SECRET',
      callbackURL : 'http://localhost:3000/auth/github/callback'
  },
  google : {
    clientID : "APP_ID",
      clientSecret : "APP_SECRET",
      callbackURL : "http://localhost:3000/auth/google/callback"
  }
};