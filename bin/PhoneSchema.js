var PhoneSchema = function(di) {
  validate = di.validate;
  validator = di.validators.phone;
  
  this.graoui = {
    label: "Phones",
    description: "Phones",
    refLabel: ['ddi', 'ddd', 'number']
  };

  this.json = {
    type : {
      type: Array,
      graoui: {
        label: "Type",
        type: 'select',
        options: { "RESIDENCE": "Residence", "COMERCIAL": "Comercial", "MOBILE": "Mobile", "FAX": "Fax" }
      }
    },
    ddi : {
      type : Number,
      required : false,
      graoui: {
        label: "Ddi",
        type: 'input'
      }
    },
    ddd : {
      type : Number,
      required : false,
      graoui: {
        label: "Ddd",
        type: 'input'
      }
    },
    number : {
      type : Number,
      required : false,
      graoui: {
        label: "Number",
        type: 'input'
      }
    }
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = PhoneSchema;
