var CustomerSchema = function(di) {
  var validate = di.validate;
  var validator = di.validators.customer;

  this.graoui = {
    bundle: "customer",
    label: "Customer",
    description: "All customers",
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
      ref: "Customersituation",
      graoui: {
        label: "Situation",
        type: 'select',
        isList: true,
        isFilter: true  
      }
    },
    budget_services : [{
      type : di.mongoose.Schema.ObjectId,
      ref: "Service",
      graoui: {
        label: "Budget services",
        type: "select",
        attr: { multiple : true },
        isList: true,
        isFilter: true
      }
    }],
    users : [{
      type : di.mongoose.Schema.ObjectId,
      ref: "User",
      graoui: {
        label: "User",
        type: "select",
        attr: { multiple : true },
        isList: true,
        isFilter: true
      }
    }]
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = CustomerSchema;
