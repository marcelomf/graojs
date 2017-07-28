var PhoneSchema = function(di) {
  validate = di.validate;
  validator = di.validators.phone;
  
  this.graoui = {
    bundle: "cadastre",
    label: "Phones",
    description: "Phones",
    refLabel: "number"
  };

  this.json = {
    type : {
      type: String,
      lowercase: true,
      graoui: {
        label: "Type",
        type: 'select',
        options: { "residence": "Residence", "comercial": "Comercial", "mobile": "Mobile", "fax": "Fax" }
      }
    },
    principal: {
      type: Boolean,
      index: true,
      graoui: {
        label: "Principal",
        type: "checkbox"
      }
    },
    ddi : {
      type : Number,
      validate : validate('isInt'),
      graoui: {
        label: "Ddi",
        type: 'input'
      }
    },
    ddd : {
      type : Number,
      validate : validate('isInt'),
      graoui: {
        label: "Ddd",
        type: 'input'
      }
    },
    number : {
      type : Number,
      validate : validate('isInt'),
      graoui: {
        label: "Number",
        type: 'input'
      }
    },
    branch : {
      type : Number,
      validate : validate('isInt'),
      graoui: {
        label: "Branch",
        type: 'input'
      }
    }
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = PhoneSchema;
