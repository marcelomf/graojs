var validate, $i;
var {{ schema | capitalize }}Validator = function(di) {
  $i = di;
  validate = $i.validate;
  return {};
};

module.exports = exports = {{ schema | capitalize }}Validator;