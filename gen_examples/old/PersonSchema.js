var PersonSchema = function(di) {
  var validate = di.validate;
  var validator = di.validators.person;

  this.graoui = {
    bundle: "cadastre",
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
    born : {
      type: Date,
      validate : validate('isDate'),
      graoui: {
        label: "Born",
        type: 'date'
      }
    },
    emails : [(di.schemas.email != null) ? di.schemas.email.json : (new (require('./EmailSchema'))(di)).json],
    phones : [(di.schemas.phone != null) ? di.schemas.phone.json : (new (require('./PhoneSchema'))(di)).json],
    address : [(di.schemas.address != null) ? di.schemas.address.json : (new (require('./AddressSchema'))(di)).json],
    urls : [{
      type : {
        type: String,
        lowercase: true,
        graoui: {
          label: "Type",
          type: 'select',
          options: { "comercial": "Comercial", "blog": "Blog", "linkedin": "LinkedIn", 
          "facebook": "FaceBook", "twitter": "Twitter", "youtube": "YouTube" }
        }
      },
      url: {
        type : String,
        lowercase : true,
        trim : true,
        validate : validate('isUrl'),
        graoui: {
          label: "Url",
          type: 'url'
        }
      }
    }],
    type : {
      type: String,
      lowercase: true,
      graoui: {
        label: "Person Type",
        type: 'radio',
        options: { "individual": "Individual", "legalentity": "Legal Entity" }
      }
    },
    individual: {
      sex : {
        type: String,
        lowercase: true,
        graoui: {
          label: "Sex",
          type: 'radio',
          options: { "masculine": "Masculine", "feminine": "Feminine" }
        }
      },
      cpf : {
        type: String,
        lowercase: true,
        trim : true,
        unique : true,
        sparse : true,
        graoui: {
          label: "CPF",
          type: 'input'
        }
      },
      relationships : [{
        type: {
          type: String,
          lowercase : true,
          graoui : {
            label : "Type",
            type : "select",
            options: { "legalguardians": "Legal Guardian", "contacts": "Contacts" },
            isList : true,
            isFilter : true
          }
        },
        persons: [{
          type: di.mongoose.Schema.ObjectId,
          ref: "Person",
          graoui : {
            label : "Person",
            type : "select",
            attr : { multiple : true }
          }
        }],
      }],
    },
    legal_entity: {
      cnpj : {
        type: String,
        lowercase: true,
        trim : true,
        unique : true,
        sparse : true,
        graoui: {
          label: "CNPJ",
          type: 'input'
        }
      },
      state_registration : {
        type: String,
        lowercase: true,
        trim : true,
        unique : true,
        sparse : true,
        graoui: {
          label: "State Registration",
          type: 'input'
        }
      },
      relationships : [{
        type: {
          type: String,
          lowercase : true,
          graoui : {
            label : "Type",
            type : "select",
            options: { "representatives": "Representatives", "partners": "Partners", "branchs" : "Branchs"},
            isList : true,
            isFilter : true
          }
        },
        persons: [{
          type: di.mongoose.Schema.ObjectId,
          ref: "Person",
          graoui : {
            label : "Person",
            type : "select",
            attr : { multiple : true }
          }
        }],
      }],
    },
    news : {
      type: Boolean,
      graoui: {
        label: "Receive newsletter ?",
        type: 'checkbox',
        value: "IS_NEWS",
        attr: { checked: true }
      }
    },
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = PersonSchema;
