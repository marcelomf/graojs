var ActivitySchema = function(di) {
  validate = di.validate;
  validator = di.validators.activity;

  this.graoui = {
    bundle: "access",
    label: "Activitys",
    description: "Activitys of users",
    refLabel: 'name'
  };

  this.json = {
    id : di.mongoose.Schema.ObjectId,
    name : {
      type : String,
      required : true,
      trim : true,
      unique : true,
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
      unique : true,
      lowercase: true,
      graoui: {
        label: "Code",
        type: 'input'
      }
    },
    description : {
      type: String,
      graoui: {
        label: "Description",
        type: 'textarea'
      }
    }
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = ActivitySchema;
