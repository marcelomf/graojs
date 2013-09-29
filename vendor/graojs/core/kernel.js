var crypto = require("crypto"), 
	hash = crypto.createHash("sha256"), 
	mongoose = require('mongoose'), 
	validate = require('mongoose-validator').validate,
	styles = require('./styles'),
	states = require('./states');

var GraoKernel = function(di) {
	
	this.config = di.config;
	this.grao = di.grao;
	this.express = di.express;
	
	this.logger = new require('./logger')(this.config);
	this.logger.info('{ ' + this.config.name + ' }');
	
	this.event = new (require('./event'))({
		generator: new (require('../generator/generator'))({name: 'kernel'}),
		logger: this.logger,
		styles: styles,
		states: states,
		
		name: 'kernel', 
		message: '{GRAO}{UCFIRST}{NAME} loading...', 
		mandatory: true,
		style: styles.PRIMARY,
		state: states.INITIAL
	}).present().log('info');
	
	this.validators = new (require('./validator'))({
		event: this.event,
		mongoose : mongoose,
		validate : validate
	});
	
	this.schemas = new (require('./schema'))({
		event: this.event,
		mongoose : mongoose,
		validate : validate,
		validators : this.validators
	});

	this.models = new (require('./model'))({
		event: this.event,
		config : this.config,
		mongoose : mongoose,
		schemas : this.schemas,
		hash : hash
	});

	this.controllers = new (require('./controller'))({
		config : this.config,
		models : this.models,
		event: this.event
	});

	this.routes = function() {
		return new (require('./route'))({
			event: this.event,
			grao : this.grao,
			controllers : this.controllers
		});
	};

	this.publics = require('./public');

};

module.exports = exports = GraoKernel;