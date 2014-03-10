var GraoKernel = function(di) {
  for(iDi in di) {
    this[iDi] = di[iDi];
  }
  this.__ = this.i18n.__;
  this.mongoose = require('mongoose');
  this.mongooseValidator = require('mongoose-validator');
  this.validate = this.mongooseValidator.validate;
  this.styles = require('./styles');
  this.states = require('./states');
  this.stackTrace = require('stack-trace');
  this._ = require('lodash');
  this.S = require('string');
  this.moment = require('moment');
  this.humanize = require('humanize');
  this.is = require('is-js');
  this.emailTemplates = require('email-templates');
  this.nodemailer = require('nodemailer');
  this.path = require('path');
  this.fs = require('fs-extra');
  this.Q = require('q');
  this.crypto = require('crypto');
  this.logger = new require('./GraoLogger')(this.config);
  this.logger.info('{ ' + this.config.name + ' }');
  this.loader = new (require('./GraoLoader'))(this);
  this.hash = function(string){
    return this.crypto.createHmac(this.config.hashAlgo, this.config.secretSalt).update(string).digest('hex');
  }
  
  this.event = new (require('./GraoEvent'))({
    logger: this.logger,
    styles: this.styles,
    states: this.states,
    stackTrace: this.stackTrace,
    
    name: 'GraoKernel',
    message: 'loading...', 
    mandatory: true,
    style: this.styles.PRIMARY,
    state: this.states.INITIAL
  }).present().log('info');
  
  this.validators = new (require('./GraoValidator'))(this);
  this.schemas = new (require('./GraoSchema'))(this);
  this.models = new (require('./GraoModel'))(this);
  this.controllers = new (require('./GraoController'))(this);
  this.routes = function() {
    return new (require('./GraoRoute'))(this);
  };
  this.publics = require('./GraoPublicRoute');
};

module.exports = exports = GraoKernel;
