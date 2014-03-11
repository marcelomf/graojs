var {{ schema | capitalize }}Validator = function(di) {
  this.validate = validate = di.validate;
  return {};
};

module.exports = exports = {{ schema | capitalize }}Validator;