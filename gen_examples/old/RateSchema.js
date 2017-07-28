var RateSchema = function(di) {
  var validate = di.validate;
  var validator = di.validators.rate;

  this.graoui = {
    bundle: "rate",
    label: "Rate",
    description: "Rates",
    refLabel: 'name'
  };

  this.json = {
    id : di.mongoose.Schema.ObjectId,
    name : {
      type : String,
      require: true,
      unique: true,
      sparse: true,
      graoui: {
        label: "Name",
        type: 'input',
        isList: true,
        isFilter: true
      }
    },
    type : {
      type : String,
      lowercase : true,
      graoui : {
        label : "Type",
        type : "select",
        options : { "service": "Service", "product": "Product", "solution" : "Solution" },
        attr: { multiple: true },
        isList : true,
        isFilter : true
      }
    },
    percent : {
      type : Number,
      graoui : {
        label : "Percent value",
        type : "number",
        isList: true,
        isFilter: true
      }
    },
    description : {
      type : String,
      graoui: {
        label: "Description",
        type: 'textarea',
        isList: true,
        isFilter: true
      }
    },
    actived : {
      type: Boolean,
      default: true,
      graoui: {
        label: "Actived",
        type: 'checkbox',
        value: "IS_ACTIVED",
        attr: { checked: true }
      }
    }
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = RateSchema;