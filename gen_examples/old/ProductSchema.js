var ProductSchema = function(di) {
  var validate = di.validate;
  var validator = di.validators.product;

  this.graoui = {
    bundle: "product",
    label: "Products",
    description: "All products",
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
      ref: "Productcategory",
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
        ref: "Productcategorypropertie",
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
    profit_percentage : {
      type: Number,
      graoui: {
          label: "Profit percentage",
          type: "number",
          isList: true
      }
    },
    stock: [{
      priority: {
        type: Number,
        graoui: {
          label: "Priority",
          type: "number",
          isList: true
        }
      },
      purchase_date: {
        type: Date,
        graoui: {
          label: "Purchase Date",
          type: "date",
          isList: true
        }
      },
      last_sale_date: {
        type: Date,
        graoui: {
          label: "Purchase Date",
          type: "date",
          isList: true
        }
      },
      amount: {
        type: Number,
        graoui: {
          label: "Amount",
          type: "number",
          isList: true
        }
      },
      purchase_value: {
        type: Number,
        graoui: {
          label: "Purchase value",
          type: "currency",
          isList: true
        }
      },
      sale_value: {
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
      }
    }],
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
    subproducts : [{
      type : di.mongoose.Schema.ObjectId,
      ref: "Product",
      graoui: {
        label: "Sub Products",
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

module.exports = exports = ProductSchema;