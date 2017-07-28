var ServicecategorySchema = function(di) {
  var validate = di.validate;
  var validator = di.validators.productcategory;

  this.graoui = {
    bundle: "service",
    label: "Service category",
    description: "Service category",
    refLabel: 'name'
  };

  this.json = {
    id : di.mongoose.Schema.ObjectId,
    name : {
      type : String,
      required : true,
      trim : true,
      unique: true,
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
    subcategorys : [{
      type : di.mongoose.Schema.ObjectId,
      ref: "Servicecategory",
      graoui: {
        label: "Sub Categorys",
        type: 'select',
        attr: {multiple: true},
        isList: true,
        isFilter: true
      }
    }]
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = ServicecategorySchema;
