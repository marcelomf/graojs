var PersonSchema = function(di) {
  var validate = di.validate;
  var validator = di.validators.person;

  var phoneSchema = new di.mongoose.Schema();

  this.graoui = {
    label: "Persons",
    description: "All people",
    refLabel: 'name'
  };

  this.json = {
    id : di.mongoose.Schema.ObjectId,
    name : {
      type : String,
      required : true,
      trim : true,
      graoui: {
        label: "Name",
        type: 'input',
        isList: true,
        isFilter: true
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
        type: 'email',
        isList: true,
        isFilter: true
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
    address : (di.schemas.address != null) ? di.schemas.address.json : (new (require('./AddressSchema'))(di)).json,
    phones : [(di.schemas.phone != null) ? di.schemas.phone.json : (new (require('./PhoneSchema'))(di)).json],
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
