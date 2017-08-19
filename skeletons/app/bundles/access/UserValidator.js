var validate, $i;
var UserValidator = function(di) {
  $i = di;
  validate = $i.validate;
  return {
    password: [function(value){
      if(value.length < 8)
        return false;

      return true;
    }, "Invalid password"],
    username: [
      validate({
	validator: 'isLength',
	arguments: [3,100],
        message : "Username need be having between 3 to 100 letters/numbers."
      }),

      validate({
	validator: 'isAlphanumeric',
	passIfEmpty: false,
        message : "Username need to be alpha numeric."
      })
    ]
  }
};

module.exports = exports = UserValidator;
