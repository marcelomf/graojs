var validate;
var methods = {};

var ActivityValidator = function(di) {
  this.validate = validate = di.validate;
  return methods;
};

module.exports = exports = ActivityValidator;