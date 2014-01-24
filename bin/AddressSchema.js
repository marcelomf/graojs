var AddressSchema = function(di) {
  validate = di.validate;
  validator = di.validators.address;

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
    details : {
        type : String,
        required : false,
        trim : true,
        graoui: {
          label: "Details",
          type: 'textarea'
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
    number : {
      type: Number,
      graoui: {
        label: "Number",
        type: 'number'
      }
    }
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = AddressSchema;
