var http = require('http'),
  express = require('express'),
  graoExpress = express(),
  kernel = new (require('./src/core/GraoKernel')) ({
    config: require('./../../config/prod'),
    graoExpress: graoExpress,
    express: express
  }),
  servers = new Array(),
  i18n = require('i18n');

if (kernel.config.template_engine == 'swig') {
  var swig = require('swig');
}

var graoJS = function() {
  kernel.logger.info('Setting global configs...');

  i18n.configure({
    locales: ['en', 'pt-br'],
    cookie: 'locale',
    defaultLocale: 'en',
    directory: kernel.config.locales
  });

  graoExpress.configure(function() {

    graoExpress.set('views', kernel.config.bundles);
    if (kernel.config.template_engine == 'swig') {
      graoExpress.engine('html', swig.renderFile);
    }
    graoExpress.set('view engine', kernel.config.template_engine);
    graoExpress.enable('jsonp callback');

    graoExpress.use(express.methodOverride());
    graoExpress.use(express.cookieParser());
    graoExpress.use(express.bodyParser());
    graoExpress.use(i18n.init);

    kernel.publics.enable({
      express: express,
      graoExpress: graoExpress,
      event: kernel.event,
      config: kernel.config,
      loader: kernel.loader
    });

    graoExpress.use(graoExpress.router);
  });

  kernel.routes();

  this.kernel = kernel;
  this.servers = servers;

  this.start = function() {
    kernel.logger.info('graoJS Starting...');
    kernel.logger.info('Open in your browser:');

    if (process.env.PORT != undefined) {
      servers.push(graoExpress.listen(process.env.PORT));
      kernel.logger.info('http://localhost:' + process.env.PORT);
    } else {
      for(portIndex in kernel.config.ports) {
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