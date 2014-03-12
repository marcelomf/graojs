var UserValidator = function(di) {
  return {
    password: [function(value){
      if(value.length < 8)
        return false;

      return true;
    }, "Invalid password"],
    username: [
      di.validate({
        message : "Username need be having between 3 to 100 letters/numbers."
      }, 'len', 3, 100),

      di.validate({
        message : "Username need to be alpha Numeric."
      }, 'isAlphanumeric')
    ]
  }
};

module.exports = exports = UserValidator;