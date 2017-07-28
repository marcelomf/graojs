var EmailSchema = function(di) {
  validate = di.validate;
  validator = di.validators.email;
  
  this.graoui = {
    bundle: "cadastre",
    label: "Emails",
    description: "Emails",
    refLabel: "email"
  };

  this.json = {
    principal: {
      type: Boolean,
      index: true,
      graoui: {
        label: "Principal",
        type: "checkbox"
      }
    },
    email : {
      type : String,
      lowercase : true,
      index : true,
      trim : true,
      validate : validate('isEmail'),
      graoui: {
        label: "Email",
        type: 'email',
        isList: true,
        isFilter: true
      }
    },
    activated: {
      type: Boolean,
      index: true,
      graoui: {
        label: "Activated",
        type: "checkbox"
      }
    }
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = EmailSchema;