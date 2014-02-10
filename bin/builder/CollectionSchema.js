var CollectionSchema = function(di) {
  var validate = di.validate;
  var validator = di.validators.collection;

  this.graoui = {
    label: "Collections",
    description: "Collections for systems",
    refLabel: 'name'
  };

  this.json = {
    id : di.mongoose.Schema.ObjectId,
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
    name : {
      type : String,
      required : true,
      trim : true,
      lowercase : true,
      graoui: {
        label: "Name",
        type: 'input',
        isList: true,
        isFilter: true
      }
    },
    reflabel : {
      type : String,
      trim : true,
      graoui: {
        label: "Ref. Label",
        type: 'input'
      }
    },
    description : {
      type : String,
      graoui: {
        label: "Description",
        type: 'textarea',
        isFilter: true
      }
    },
    fields : [{
      type: di.mongoose.Schema.ObjectId,
      ref: "Field",
      graoui: {
        label: "Fields",
        type: "select",
        attr: { multiple: true },
        isList: true,
        isFilter: true
      }
    }],
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = CollectionSchema;
