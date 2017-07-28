var ProviderSchema = function(di) {
  var validate = di.validate;
  var validator = di.validators.provider;

  this.graoui = {
    bundle: "provider",
    label: "Provider",
    description: "All providers",
    refLabel: 'person.name'
  };

  this.json = {
    id : di.mongoose.Schema.ObjectId,
    person : {
      type : di.mongoose.Schema.ObjectId,
      ref: "Person",
      index: true,
      unique: true,
      sparse: true,
      graoui: {
        label: "Person",
        type: 'select',
        isList: true,
        isFilter: true
      }
    },
    situation : {
      type : di.mongoose.Schema.ObjectId,
      ref: "Providersituation",
      graoui: {
        label: "Situation",
        type: 'select',
        isList: true,
        isFilter: true
      }
    },
    services : [{
      type : di.mongoose.Schema.ObjectId,
      ref: "Service",
      graoui: {
        label: "Service",
        type: "select",
        attr : { multiple : true },
        isList: true,
        isFilter: true
      }
    }]
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = ProviderSchema;
