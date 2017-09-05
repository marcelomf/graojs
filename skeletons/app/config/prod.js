var fs = require('fs'), 
  path = require('path'), 
  rootPath = path.normalize(path.join(__dirname, '..')),
  charset = 'utf-8',
  packageJson = JSON.parse(fs.readFileSync(path.join(rootPath,'package.json'), charset));

module.exports = exports = {
  packageJson: packageJson,
  ports : [{{server_ports}}],
  charset: charset,
  db: 'mongodb://{{mongodb_host}}/{{mongodb_db}}',
  rootPath: rootPath,
  localesPath: path.join(rootPath, "config", "locales"),
  locales: ['pt-br', 'es', 'en'],
  defaultLocale: 'en',
  bundles: path.join(rootPath, "bundles"),
  templateEngine : 'pug',
  name : packageJson.name,
  description : packageJson.description,
  smtpOptions: {
    host: "smtp.yourserver.com",
    secureConnection: true,
    port: 465,
    auth: {
      user: "username@yourserver.com",
      pass: "yourpassword"
    }
  },
  secretSession: 'FIXME AND RAND THIS',
  secretSalt: 'FIXME AND RAND THIS',
  hashAlgo: 'sha256',
  log : {
    transport : {
      console : { colorize: true, json : false, timestamp : true, level : 'info' },
      file : { filename : path.join(rootPath, 'log', '{{name}}.log'), json : false, level : 'error' }
    },
    exception : {
      console : { colorize: true, json : false, timestamp : true, level : 'info' },
      file : { filename : path.join(rootPath, 'log', '{{name}}.log'), json : false, level : 'error' }
    },
  },
  injection: {
    kernel: [
      { name: 'mongoose', object: 'mongoose' },
      { name: 'mongooseValidator', object: 'mongoose-validator' },
      { name: 'validate', object: 'kernel.mongooseValidator' },
      { name: 'styles', object: './styles' },
      { name: 'states', object: './states' },
      { name: 'stackTrace', object: 'stack-trace' },
      { name: '_', object: 'lodash' },
      { name: 'S', object: 'string' },
      { name: 'moment', object: 'moment' },
      { name: 'humanize', object: 'humanize' },
      /*{ name: 'emailTemplates', object: 'email-templates' },*/
      { name: 'nodemailer', object: 'nodemailer' },
      { name: 'fs', object: 'fs-extra' },
      { name: 'path', object: 'path' },
      { name: 'url', object: 'url' },
      { name: 'Q', object: 'q' },
      { name: 'crypto', object: 'crypto' }
    ]
  }
};
