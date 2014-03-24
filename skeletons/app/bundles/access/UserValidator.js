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
        message : "Username need be having between 3 to 100 letters/numbers."
      }, 'len', 3, 100),

      validate({
        message : "Username need to be alpha numeric."
      }, 'isAlphanumeric')
    ]
  }
};

module.exports = exports = UserValidator;