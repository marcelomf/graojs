var ServiceSchema = function(di) {
  var validate = di.validate;
  var validator = di.validators.product;

  this.graoui = {
    bundle: "service",
    label: "Services",
    description: "All services",
    refLabel: 'name'
  };

  this.json = {
    id : di.mongoose.Schema.ObjectId,
    name : {
      type : String,
      required : true,
      trim : true,
      unique: true,
      sparse : true,
      graoui: {
        label: "Name",
        type: 'input',
        isList: true,
        isFilter: true
      }
    },
    code : {
      type : String,
      required : true,
      trim : true,
      unique: true,
      lowercase: true,
      graoui: {
        label: "Code",
        type: 'input',
        isList: true,
        isFilter: true
      }
    },
    description : {
      type : String,
      graoui: {
        label: "Description",
        type: 'textarea'
      }
    },
    category : [{
      type : di.mongoose.Schema.ObjectId,
      ref: "Servicecategory",
      graoui: {
        label: "Categorys",
        type: 'select',
        attr: {multiple: true},
        isList: true,
        isFilter: true
      }
    }],
    properties : [{
      propertie : {
        type: di.mongoose.Schema.ObjectId,
        ref: "Servicecategorypropertie",
        graoui : {
          label: "Propertie",
          type: "select"
        }
      },
      value : {
        type: Number,
        graoui : {
          label: "Value",
          type: "input"
        }
      }
    }],
    periodicity : {
      type : String,
      lowercase : true,
      graoui : {
        label : "Periodicity",
        type : "select",
        options : { "unique" : "Unique", "daily": "Daily", "weekly": "Weekly", "biweekly": "Biweekly", "monthly": "Monthly", 
                    "bimonthly": "Bimonthly", "quarterly": "Quarterly", "semiannual": "Semiannual", "annual": "Annual" },
        isList: true,
        isFilter: true
      }
    },
    rates: [{
      type : di.mongoose.Schema.ObjectId,
      ref: "Rate",
      graoui: {
        label: "Rates",
        type: "select",
        attr : { multiple: true },
        isList: true,
        isFilter: true
      }
    }],
    promotions: [{
      type : di.mongoose.Schema.ObjectId,
      ref: "Promotion",
      graoui: {
        label: "Promotions",
        type: "select",
        attr : { multiple: true },
        isList: true,
        isFilter: true
      }
    }],
    cost_value : {
      type: Number,
      graoui: {
          label: "Cost value",
          type: "number",
          isList: true
      }
    },
    profit_percentage : {
      type: Number,
      graoui: {
          label: "Profit percentage",
          type: "number",
          isList: true
      }
    },
    sale_value : {
      type: Number,
      graoui: {
        label: "Sale value",
        type: "currency",
        isList: true
      }
    },
    markup : {
      type: Number,
      graoui: {
        label: "Markup",
        type: "number",
        isList: true
      }
    },
    subservices : [{
      type : di.mongoose.Schema.ObjectId,
      ref: "Service",
      graoui: {
        label: "Sub Services",
        type: 'select',
        attr: {multiple: true},
        isList: true,
        isFilter: true
      }
    }],
    gallery : [{ 
      principal : Boolean, 
      description : String, 
      file : String, 
      category : { 
        type : di.mongoose.Schema.ObjectId,
        ref : "Gallerycategory"
      } 
    }],
    files : [{ 
      principal : Boolean, 
      description : String, 
      file : String, 
      category : { 
        type : di.mongoose.Schema.ObjectId,
        ref : "Filecategory"
      } 
    }]
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = ServiceSchema;