/**
A vista
-----------
A prazo
 - Quantas vezes ?
 - Quantas vezes no que ?


- Especie
- No boleto
- No cheque
- No cartão
  - No debito
  - No crédito
*/
var SaleSchema = function(di) {
  var validate = di.validate;
  var validator = di.validators.sale;

  this.graoui = {
    bundle: "sale",
    label: "Sales",
    description: "Sales"
  };

  this.json = {
    id : di.mongoose.Schema.ObjectId,
    customer: {
      type : di.mongoose.Schema.ObjectId,
      ref : "Customer",
      required: true,
      graoui : {
        label: "Customer",
        type: "select",
        isList: true,
        isFilter: true
      }
    },
    type : {
      type : di.mongoose.Schema.ObjectId,
      ref: "Saletype",
      graoui: {
        label: "Type",
        type: "select",
        isList: true,
        isFilter: true
      }
    },
    celebration_date : {
      type: Date,
      validate : validate('isDate'),
      graoui : {
        label: "Celebration Date",
        type: "date"
      }
    },
    services : [{
      service: {
        type : di.mongoose.Schema.ObjectId,
        ref: "Service",
        graoui: {
          label: "Services",
          type: "select",
        }
      },
      expiration_date : {
        type: Date,
        validate : validate('isDate'),
        graoui : {
          label: "Expiration Date",
          type: "date"
        }
      },
      payday : {
        type: Date,
        default: Date.now,
        graoui : {
          label: "Pay day",
          type: "date",
          isList: true,
          isFilter: true
        }
      }
    }],
    observation : {
      type : String,
      graoui: {
        label: "Observation",
        type: 'textarea'
      }
    },
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

module.exports = exports = SaleSchema;
