var PoliticoSchema = function(di) {
    validate = di.validate;
    validator = di.validators.politico;

    this.json = {
        id : di.mongoose.Schema.ObjectId,
        nome : {
            type : String,
            required : false,
            trim : true,
            graoui: {
                label: "Nome",
                type: 'input'
            }
        },
        patido : {
            type : String,
            required : false,
            trim : true,
            graoui: {
                label: "Partido",
                type: 'input'
            }
        },
        email : {
            type : String,
            lowercase : true,
            required : false,
            index : true,
            unique : false,
            trim : true,
            validate : validate('isEmail'),
            graoui: {
                label: "Email",
                type: 'email'
            }
        },
        site : {
            type : String,
            lowercase : true,
            required : false,
            trim : true,
            validate : validate('isUrl'),
            graoui: {
                label: "Site",
                type: 'url'
            }
        },
    };

    this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = PoliticoSchema;
