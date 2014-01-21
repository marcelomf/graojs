var ActivitySchema = function(di) {
  validate = di.validate;
  validator = di.validators.activity;

  this.json = {
    id : di.mongoose.Schema.ObjectId,
    name : {
      type : String,
      required : false,
      trim : true,
      unique : true,
      graoui: {
        label: "Name",
        type: 'input'
      }
    },
    tag : {
      type : String,
      required : true,
      trim : true,
      unique : true,
      lowercase: true,
      graoui: {
        label: "Tag",
        type: 'input'
      }
    },
    activitys: [{ 
      type: di.mongoose.Schema.Types.ObjectId, 
      ref: 'Activity',
      graoui: {
        label: "Context(Sub Activitys)",
        fieldRefLabel: "name",
        type: "select",
        attr: { multiple: true }
      }
    }],
    description : {
      type: String,
      graoui: {
        label: "Description",
        type: 'textarea',
        attr: { placeholder: "Description" }
      }
    }
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = ActivitySchema;
