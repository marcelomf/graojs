var AddressSchema = function(di) {
  validate = di.validate;
  validator = di.validators.address;

  this.graoui = {
    label: "Address",
    description: "Address of people",
    refLabel: ['country','state','city','zip_code','sector','street','number']
  };

  this.json = {
    country : {
      type : String,
      required : false,
      trim : true,
      graoui: {
        label: "Country",
        type: 'input'
      }
    },
    state : {
      type : String,
      required : false,
      trim : true,
      graoui: {
        label: "State",
        type: 'input'
      }
    },
    city : {
      type : String,
      required : false,
      trim : true,
      graoui: {
        label: "City",
        type: 'input'
      }
    },
    zip_code : {
        type : String,
        required : false,
        trim : true,
        graoui: {
          label: "Zip Code",
          type: 'input'
        }
    },
    sector : {
      type : String,
      required : false,
      trim : true,
      graoui: {
        label: "Sector",
        type: 'input'
      }
    },
    street : {
      type : String,
      required : false,
      trim : true,
      graoui: {
        label: "Street",
        type: 'input'
      }
    },
    number : {
      type: Number,
      graoui: {
        label: "Number",
        type: 'number'
      }
    },
    details : {
        type : String,
        required : false,
        trim : true,
        graoui: {
          label: "Details",
          type: 'textarea'
        }
    }
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = AddressSchema;
