var UserSchema = function(di) {
  validate = di.validate;
  validator = di.validators.user;

  this.json = {
    id : di.mongoose.Schema.ObjectId,
    name : {
      type : String,
      required : false,
      trim : true,
      graoui: {
        label: "Name",
        type: 'input'
      }
    },
    username : {
      type : String,
      required : false,
      trim : true,
      graoui: {
        label: "User Name",
        type: 'input'
      }
    },
    password : {
      type : String,
      required : false,
      graoui: {
        label: "Password",
        type: 'password'
      }
    },
    email : {
      type : String,
      lowercase : true,
      required : false,
      index : true,
      unique : false,
      trim : true,
      validate : validate('isEmail'),
      graoui: {
        label: "Email",
        type: 'email'
      }
    },
    blog : {
      type : String,
      lowercase : true,
      required : false,
      trim : true,
      validate : validate('isUrl'),
      graoui: {
        label: "Blog",
        type: 'url'
      }
    },
    idade: {
      type : Number,
      required : false,
      validate : validate('isInt'),
      graoui: {
        label: "Idade",
        type: 'number'
      }
    }
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = UserSchema;
