var PersonSchema = function(di) {
  validate = di.validate;
  validator = di.validators.person;

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
    born : {
      type: Number,
      graoui: {
        label: "Born",
        type: 'date'
      }
    },
    kids : {
      type: Number,
      graoui: {
        label: "Kids",
        type: 'number'
      }
    },
    sex : {
      type: String,
      graoui: {
        label: "Sex",
        type: 'radio',
        options: { "M": "Masculine", "F": "Feminine" }
      }
    },
    news : {
      type: Boolean,
      graoui: {
        label: "Do you want to receive news ?",
        type: 'checkbox',
        value: "IS_NEWS",
        attr: { checked: true }
      }
    },
    address : {
      type: String,
      graoui: {
        label: "Address",
        type: 'textarea',
        attr: { placeholder: "Your Address" }
      }
    },
    money : {
      type: Number,
      graoui: {
        label: "Money",
        type: 'currency'
      }
    }
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = PersonSchema;
