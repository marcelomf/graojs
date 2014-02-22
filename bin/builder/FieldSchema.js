var FieldSchema = function(di) {
  var validate = di.validate;
  var validator = di.validators.field;

  this.graoui = {
    label: "Fields",
    description: "Fields of collections",
    refLabel: 'name'
  };

  this.json = {
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
    label : {
      type : String,
      trim : true,
      graoui: {
        label: "Label",
        type: 'input',
        isList: true,
        isFilter: true
      }
    },
    defaultvalue : {
      type : String,
      graoui: {
        label: "Default Value",
        type: 'input'
      }
    },
    reference : {
      type : di.mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      graoui: {
        label: "Reference",
        type:  "select"
      }
    },
    typeui : {
      type : Array,
      graoui: {
        label: "UI Grao Type",
        type:  "select",
        options: { "text": "Text", "email": "Email", "url": "Url", "date": "Date", "textarea": "Text Area", "select": "Select",
                    "number": "Number", "password": "Password", "checkbox": "Checkbox", "radio": "Radio", "union": "Union" },
        isList: true,
        isFilter: true
      }
    },
    typedb : {
      type : String,
      graoui: {
        label: "Database Type",
        type:  "select",
        options: { "String": "String", "Number": "Number", "Date": "Date", "Buffer": "Buffer", "Boolean": "Boolean",
          "di.mongoose.Schema.Types.ObjectId": "Reference", "Mixed": "Mixed", "ObjectId": "ObjectId", "Array": "Array" },
        isList: true,
        isFilter: true
      }
    },
    optionsfield : {
      type : Array,
      graoui: {
        label: "Options Field",
        type:  "select",
        options: { "lowercase": "Lower Case", "required": "Required", "index": "Index", "unique": "Unique", "isArray": "Is Array", 
                    "trim": "Trim", "isList": "Is List", "isFilter": "Is Filter", "isSubDoc": "Is Sub Doc" },
        attr: { multiple: true},
        isList: true,
        isFilter: true
      }
    },
    attrfield : {
      type : String,
      graoui: {
        label: "HTML Attributes",
        type: 'text'
      }
    },
    validator : {
      type : String,
      trim: true,
      graoui: {
        label: "Validator",
        type:  "select",
        options: { "isEmail": "It is Email", "isURL": "It is Url", "isIP": "It is IP", 
          "isAlpha": "It is Alpha", "isNumeric": "It is Numeric", "isAlphanumeric": "It is Alphanumeric", 
          "isHexadecimal": "It is Hexadecimal", "isHexColor": "It is Hex. Color", "isLowercase": "It is Lower Case",
          "isAlpha": "It is Alpha", "isNumeric": "It is Numeric", "isAlphanumeric": "It is Alphanumeric",
          "isUppercase": "It is Upper Case", "isInt": "It is Integer", "isFloat": "It is Float",
          "isNull": "It is Null", "isDate": "It is Date", "isCreditCard": "It is Credit Card"
        },
        isList: true,
        isFilter: true
      }
    }, // https://github.com/chriso/validator.js https://github.com/ctavan/express-validator
    description : {
      type : String,
      graoui: {
        label: "Description",
        type: 'textarea'
      }
    },
    optionsvalue: [{
      key: { 
        type: String,
        trim: true,
        graoui: {
          label: "Key",
          type: "input"
        }
      },
      value: { 
        type: String,
        graoui: {
          label: "Value",
          type: "input"
        }
      }
    }]
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = FieldSchema;
