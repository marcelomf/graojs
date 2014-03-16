var GraoKernel = function(di) {
  for(var iDi in di) {
    this[iDi] = di[iDi];
  }
  var diKernel = this.config.injection.kernel;
  for(var i in diKernel){
    if(diKernel[i].object.indexOf('kernel.') == 0) {
      var jumps = diKernel[i].object.replace('kernel.', '').split('.');
      var newJump = this;
      for(var y in jumps) {
        newJump = newJump[jumps[y]];
      }
      this[diKernel[i].name] = newJump;
      delete newJump;
      delete jumps;
    } else {
      if(diKernel[i].object.indexOf('./') == 0)
        diKernel[i].object = this.path.join(__dirname, diKernel[i].object.replace('./', ''));
      this[diKernel[i].name] = require(this.path.normalize(diKernel[i].object));
    }
  }

  this.logger = new require(this.path.join(__dirname, 'GraoLogger'))(this.config);
  this.logger.info('{ ' + this.config.name + ' }');
  this.loader = new (require(this.path.join(__dirname, 'GraoLoader')))(this);
  this.hash = function(string){
    return this.crypto.createHmac(this.config.hashAlgo, this.config.secretSalt).update(string).digest('hex');
  }
  
  this.event = new (require(this.path.join(__dirname, 'GraoEvent')))({
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
  
  this.validators = new (require(this.path.join(__dirname, 'GraoValidator')))(this);
  this.schemas = new (require(this.path.join(__dirname, 'GraoSchema')))(this);
  this.models = new (require(this.path.join(__dirname, 'GraoModel')))(this);
  this.controllers = new (require(this.path.join(__dirname, 'GraoController')))(this);
  this.routes = function() {
    return new (require(this.path.join(__dirname, 'GraoRoute')))(this);
  };
  this.publics = require(this.path.join(__dirname, 'GraoPublicRoute'));
};

module.exports = exports = GraoKernel;
