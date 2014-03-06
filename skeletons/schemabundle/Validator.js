var validate;
var methods = {};

var {{ schema | capitalize }}Validator = function(di) {
  this.validate = validate = di.validate;
  return methods;
};

module.exports = exports = {{ schema | capitalize }}Validator;