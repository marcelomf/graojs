var UserSchema = function(di) {
  validate = di.validate;
  validator = di.validators.user;

  this.graoui = {
    label: "Users",
    description: "Users of the system",
    refLabel: 'username'
  };

  this.json = {
    id : di.mongoose.Schema.ObjectId,
    person: { 
      type: di.mongoose.Schema.Types.ObjectId, 
      ref: 'Person',
      graoui: {
        label: "Person",
        type: "union",
        isList: true,
        isFilter: true
      },
    },
    activitys: [{ 
      type: di.mongoose.Schema.Types.ObjectId, 
      ref: 'Activity',
      graoui: {
        label: "Activitys",
        fieldRefLabel: "name",
        type: "select",
        attr: { multiple: true },
        isList: true,
        isFilter: true
      }
    }],
    username : {
      type : String,
      required : false,
      trim : true,
      graoui: {
        label: "User Name",
        type: 'input',
        isList: true,
        isFilter: true
      }
    },
    password : {
      type : String,
      required : false,
      graoui: {
        label: "Password",
        type: 'password'
      }
    },
    languages : {
      type: Array,
      graoui: {
        label: "Languages",
        type: 'select',
        options: { "PHP": "PHP Language", "JAVA": "Java Language", "JAVASCRIPT": "Javascript Language", "PYTHON": "Python Language", "RUBY": "Ruby Language" },
        attr: { multiple: true },
        isList: true,
        isFilter: true
      }
    },
    distros : {
      type: Array,
      graoui: {
        label: "Distributions",
        type: 'select',
        options: [ "Ubuntu", "Fedora", "Debian", "Mint", "Slackware", "Gentoo" ],
        attr: { multiple: true }
      }
    },
    likes: [{ type: di.mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: di.mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: di.mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: di.mongoose.Schema.Types.ObjectId, ref: 'User' }]
  };

  this.mongoose = new di.mongoose.Schema(this.json);
};

module.exports = exports = UserSchema;
