var GraoValidator = function(di) {
  di.event.new('Instance created').success().present().log('info');
  di.validators = this;
  di.validators = di.loader.tryLoad(di.loader.loading('validator'), di, 'validators');
};

module.exports = exports = GraoValidator;
