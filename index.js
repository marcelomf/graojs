var path = require('path'),
  dirProject = process.cwd(),
  dirProject = (dirProject.indexOf('tasks') >= 0) ? path.join(dirProject, "..") : dirProject;
  config = require(path.resolve(dirProject, 'config', 'prod')),
  passport = require('passport'),
  express = require('express'),
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  json = require('express-json'),
  MongoStore = require('connect-mongo')(session),
  graoExpress = express(),
  di = {  path: path,
          config: config, 
          passport: passport,
          graoExpress: graoExpress, 
          express: express},
  kernel = new (require(path.join(__dirname, 'src', 'core', 'GraoKernel')))(di),
  i18n = require('i18n'),
  servers = new Array();

var graoJS = function() {
  kernel.logger.info('Setting global configs...');
  
  i18n.configure({
      //updateFiles: false,
      locales: kernel.config.locales,
      defaultLocale: kernel.config.defaultLocale,
      directory: kernel.config.localesPath,
      cookie: 'locale'
  });

//  var env = process.env.NODE_ENV || 'development';
//  if ('development' == env) {
     // configure stuff here
// }}


  graoExpress.set('views', kernel.config.bundles);
  graoExpress.set('view engine', kernel.config.templateEngine);
  graoExpress.enable('jsonp callback');
  //graoExpress.use(express.compress());
  // https://github.com/evilpacket/helmet
  // https://blog.liftsecurity.io/2012/12/07/writing-secure-express-js-apps
  //graoExpress.use(express.logger('dev'));
  //graoExpress.use(express.urlencoded());
  //graoExpress.use(express.multipart({defer: true})); // https://github.com/andrewrk/node-multiparty
  graoExpress.use(cookieParser());
  graoExpress.use(bodyParser.json({limit: '50mb'}));
  graoExpress.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
  graoExpress.use(methodOverride());
  graoExpress.use(i18n.init);
  graoExpress.use(session({
    secret: kernel.config.secretSession,
    store: new MongoStore({ url: kernel.config.db }),
    resave: false,
    saveUninitialized: true
  }));
  graoExpress.use(passport.initialize());
  graoExpress.use(passport.session());

  kernel.publics.enable({
    express: express, 
    graoExpress: graoExpress, 
    event: kernel.event, 
    config: kernel.config,
    loader: kernel.loader
  });
  
  graoExpress.locals.basedir = kernel.config.bundles; // For absolute templates

// development only
/*if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
*/
  setTimeout(function(){
    
  }, 10000);
  kernel.routes();
  
    
  for(var i in graoExpress._router.stack) {
    //console.log(graoExpress._router.stack[i].regexp);
    //if(graoExpress._router.stack[i].route != null && graoExpress._router.stack[i].route.path != null)
      //console.log(graoExpress._router.stack[i].route.path);
    //if(graoExpress._router.stack[i].route.path != null)
      //console.log(graoExpress._router.stack[i].route.path);
  }
  
  this.kernel = kernel;
  this.servers = servers;
  
  this.start = function() {
    kernel.logger.info('graoJS Starting...');
    kernel.logger.info('Open in your browser:');

    if (process.env.PORT != undefined) {
      servers.push(graoExpress.listen(process.env.PORT));
      kernel.logger.info('http://localhost:' + process.env.PORT);
    } else {
      for(portIndex in kernel.config.ports)
      {
        servers.push(graoExpress.listen(kernel.config.ports[portIndex]));
        kernel.logger.info('http://localhost:' + kernel.config.ports[portIndex]);
      }
    }
  };
  
  this.stop = function() {
    kernel.logger.info('graoJS Shutdown...');
    for(serverIndex in servers) {
      servers[serverIndex].close();
      delete servers[serverIndex];
    }
    servers = new Array();
  };
  
  this.restart = function() {
    this.stop();
    this.start();
  };
  
  this.status = function() {
    kernel.logger.info('graoJS Status...');
    kernel.logger.info('Number of servers: '+servers.length);
  };
};
module.exports = exports = graoJS;
module.exports.kernel = exports.kernel = kernel;
