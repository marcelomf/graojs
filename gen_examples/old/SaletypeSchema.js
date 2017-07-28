var SaletypeSchema = function(di) {
  var validate = di.validate;
  var validator = di.validators.saletype;

  this.graoui = {
    bundle: "sale",
    label: "Sale type",
    description: "Sale type",
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

module.exports = exports = SaletypeSchema;
