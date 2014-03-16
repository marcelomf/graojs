var GraoValidator = function(di) {
  di.event.newSuccess('Instance created');
  di.validators = this;
  di.validators = di.loader.tryLoad(di.loader.loading('validator'), di, 'validators');
};

module.exports = exports = GraoValidator;
