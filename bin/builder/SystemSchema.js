var SystemSchema = function(di) {
  validate = di.validate;
  validator = di.validators.system;

  this.graoui = {
    label: "Systems",
    description: "Systems of the world :)",
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
    description : {
      type: String,
      graoui: {
        label: "Description",
        type: 'textarea'
      }
    },
    theme : {
      type: String,
      graoui: {
        label: "UI Themes",
        type: 'select',
        options: { "amelia": "Amelia", "bootstrap": "Bootstrap", "cerulean": "Cerulean", "cosmo": "Cosmo", "cyborg": "Cyborg",
                    "flatly": "Flatly", "graojs": "graoJS", "journal": "Journal", "readable": "Readable", "simplex": "Simplex",
                    "slate": "Slate", "spacelab": "Space Lab", "united": "United" },
        isList: true,
        isFilter: true
      }
    },
    regions : {
      type: String,
      graoui: {
        label: "Regions",
        type: 'select',
        options: { "en": "English", "pt-br": "Portuguese Brazil", "es": "Spanish", "ch": "China", "it": "Italy", 
                    "de": "Germany", "fr": "France" },
        attr: { multiple: true },
        isList: true,
        isFilter: true
      }
    },
    collections: [{ 
      type: di.mongoose.Schema.Types.ObjectId, 
      ref: 'Collection',
      graoui: {
        label: "Collections(data, tables, bundles, modules...)",
        type: "select",
        attr: { multiple: true },
        isList: true,
        isFilter: true
      }
    }],
    hash : {
      type : String,
/*      required : true,*/
/*      unique : true,*/
      trim : true
    }
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = SystemSchema;
