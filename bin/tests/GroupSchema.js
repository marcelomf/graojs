var GroupSchema = function(di) {
  validate = di.validate;
  validator = di.validators.group;

  this.json = {
    id : di.mongoose.Schema.ObjectId,
    name : {
      type : String,
      required : false,
      trim : true,
      graoui: {
        label: "Name",
        type: 'input'
      }
    },
    description : {
      type: String,
      graoui: {
        label: "Description",
        type: 'textarea',
        attr: { placeholder: "Description" }
      }
    },
    users: [{ 
      type: di.mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      graoui: {
        label: "Users",
        fieldRefLabel: "name",
        type: "select",
        attr: { multiple: true }
      }
    }]
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = GroupSchema;
