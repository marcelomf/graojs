var 
  mongoose = require('mongoose'), 
  validate = require('mongoose-validator').validate,
  styles = require('./styles'),
  states = require('./states'),
  stackTrace = require('stack-trace');

var GraoKernel = function(di) {
  this.config = di.config;
  this.graoExpress = di.graoExpress;
  this.express = di.express;
  this.passport = di.passport;
  
  this.logger = new require('./GraoLogger')(this.config);
  this.logger.info('{ ' + this.config.name + ' }');
  
  this.loader = new (require('./GraoLoader'))({
    config: this.config
  });
  
  this.event = new (require('./GraoEvent'))({
    logger: this.logger,
    styles: styles,
    states: states,
    stackTrace: stackTrace,
    
    name: 'GraoKernel',
    message: 'loading...', 
    mandatory: true,
    style: styles.PRIMARY,
    state: states.INITIAL
  }).present().log('info');
  
  this.validators = new (require('./GraoValidator'))({
    event: this.event,
    loader: this.loader,
    mongoose : mongoose,
    validate : validate,
    config: this.config
  });
  
  this.schemas = new (require('./GraoSchema'))({
    config: this.config,
    event: this.event,
    loader: this.loader,
    mongoose : mongoose,
    validate : validate,
    validators : this.validators
  });

  this.models = new (require('./GraoModel'))({
    config : this.config,
    event: this.event,
    loader: this.loader,
    mongoose : mongoose,
    schemas : this.schemas,
    hash : hash
  });

  this.controllers = new (require('./GraoController'))({
    config : this.config,
    models : this.models,
    event: this.event,
    loader: this.loader,
    passport: this.passport
  });

  this.routes = function() {
    return new (require('./GraoRoute'))({
      config: this.config,
      event: this.event,
      loader: this.loader,
      graoExpress : this.graoExpress,
      controllers : this.controllers,
      passport: this.passport
    });
  };

  this.publics = require('./GraoPublicRoute');

};

module.exports = exports = GraoKernel;
