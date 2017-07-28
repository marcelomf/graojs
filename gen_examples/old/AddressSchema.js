var AddressSchema = function(di) {
  validate = di.validate;
  validator = di.validators.address;

  this.graoui = {
    bundle: "cadastre",
    label: "Address",
    description: "Address of people",
    refLabel: "street"
  };

  this.json = {
    type : {
      type : String,
      lowercase: true,
      trim : true,
      graoui: {
        label: "Type",
        type: 'select',
        options: { "residence": "Residence", "comercial": "Comercial" }
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
    country : {
      type : String,
      trim : true,
      index: true,
      graoui: {
        label: "Country",
        type: 'input'
      }
    },
    state : {
      type : String,
      trim : true,
      index: true,
      graoui: {
        label: "State",
        type: 'input'
      }
    },
    city : {
      type : String,
      trim : true,
      index: true,
      graoui: {
        label: "City",
        type: 'input'
      }
    },
    zip_code : {
        type : String,
        trim : true,
        graoui: {
          label: "Zip Code",
          type: 'input'
        }
    },
    sector : {
      type : String,
      trim : true,
      graoui: {
        label: "Sector",
        type: 'input'
      }
    },
    street : {
      type : String,
      trim : true,
      graoui: {
        label: "Street",
        type: 'input'
      }
    },
    number : {
      type: String,
      graoui: {
        label: "Num.",
        type: 'number'
      }
    },
    complement : {
      type : String,
      graoui: {
        label: "Complement",
        type: 'textarea'
      }
    }
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = AddressSchema;
