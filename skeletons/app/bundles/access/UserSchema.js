var UserSchema = function(di) {
  validate = di.validate;
  validator = di.validators.user;

  this.graoui = {
    bundle: "access",
    label: "Users",
    description: "Users of the system",
    refLabel: 'username'
  };

  this.json = {
    id : di.mongoose.Schema.ObjectId,
    username : {
      type : String,
      required : true,
      lowercase : true,
      unique: true,
      trim : true,
      validate: validator.username,
      graoui: {
        label: "User Name",
        type: 'input',
        isList: true,
        isFilter: true
      }
    },
    password : {
      type : String,
      required : true,
      validate: validator.password,
      graoui: {
        label: "Password",
        type: 'password'
      }
    },
    email : {
      type : String,
      lowercase : true,
      required : true,
      index : true,
      unique : true,
      trim : true,
      validate : validate({validator: 'isEmail'}),
      graoui: {
        label: "Email",
        type: 'email',
        isList: true,
        isFilter: true
      }
    },
    activitys: [{ 
      type: di.mongoose.Schema.Types.ObjectId, 
      ref: 'Activity',
      graoui: {
        label: "Activitys",
        type: "select",
        attr: { multiple: true },
        isList: true,
        isFilter: true
      }
    }],
    enabled : {
      type: Boolean,
      graoui: {
        label: "Enabled",
        type: 'checkbox',
        value: "IS_ENABLED",
        attr: { checked: true },
        isList: true,
        isFilter: true
      }
    },
    createdat: { type: Date },
    updatedat: { type: Date },
    retrievepassword: {
      token: {
        type : String,
        index : true,
        trim : true,
      },
      createdtoken: { type: Date }
    }
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = UserSchema;
