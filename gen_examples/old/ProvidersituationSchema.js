var ProvidersituationSchema = function(di) {
  var validate = di.validate;
  var validator = di.validators.providersituation;

  this.graoui = {
    bundle: "provider",
    label: "Provider Situation",
    description: "All providers situations",
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
        type: 'textarea',
        isList: true,
        isFilter: true
      }
    }
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = ProvidersituationSchema;
