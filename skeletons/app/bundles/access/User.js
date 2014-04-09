var methods = {}, statics = {}, $i;

statics.sendNewPassword = function(userJson) {
  var def = $i.Q.defer();
  var smtpTransport = $i.nodemailer.createTransport("SMTP", $i.config.smtpOptions);

  var body = "Username: "+user.username+"\n";
  body += "Password: "+user.password+"\n";

  $i.event.newSuccess(body);

  var mailOptions = {
    from: "Hostmaster <hostmaster@synack.com.br>", // sender address
    to: "marcelomf@gmail.com, marcelo@synack.com.br", // list of receivers
    subject: $i.config.name+" - "+i18n.__("New password"), // Subject line
    text: body, // plaintext body
    html: body // html body
  };

  smtpTransport.sendMail(mailOptions, function(err, response){
    if(err){
      $i.event.newError(err);
      def.reject(new Error(err));
    }else{
      $i.event.newSuccess("Message sent: " + response.message);
      def.resolve(userJson);
    }
    smtpTransport.close();
  });

  return def.promise;
}

statics.buildActivitys = function(userJson) {
  var def = $i.Q.defer();
  activityObj = { activitys : userJson.activitys || [] };

  if(activityObj.activitys.length <= 0) {
    def.resolve(userJson);
    return def.promise;
  }

  $i.models.activity.buildActivitys(activityObj).then(function(activity){
    userJson.activitys = activity.activitys;
    def.resolve(userJson);
  }).catch(function(err){
    def.reject(new Error(err));
  });

  return def.promise;
}

statics.randPasswordAndSave = function(userJson) {
  var def = $i.Q.defer();

  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var passwordLength = 8;
  var randomPass = '';
  for (var i=0; i < passwordLength; i++) {
    var num = Math.floor(Math.random() * chars.length);
    randomPass += chars.substring(num, num+1);
  }

  userJson.password = randomPass;

  if(userJson._id) {
    var userId = user._id;
    delete userJson._id;
    if(userJson.generatePassword == true)
      userJson.password = User.hashPassword(randomPass);

    User.findOneAndUpdate({_id : userId }, userJson, function(err, user) {
      if(err) return def.reject(new Error(err));
      if(userJson.generatePassword == true)
        user.cleanPassword = randomPass;
      def.resolve(user);
    });
  } else {
    var user = new User(userJson);
    user.save(function(err, user){
      if(err) return def.reject(new Error(err));
      user.cleanPassword = randomPass;
      def.resolve(user);
    });
  }

  return def.promise;
}

statics.hashPassword = function(password) {
  return $i.hash(password);
}

methods.accessId = function() {
  var acts = "";
  for(var i in this.activitys.toObject()){
    acts = acts+this.activitys[i].code;
  }
  return $i.hash(acts);
}

methods.confirmPassword = function(cleanPassword) {
  var oldHashPassword = this.password;
  this.password = cleanPassword;
  if(statics.hashPassword(cleanPassword) == oldHashPassword)
    return true;
  
  this.password = oldHashPassword;
  return false;
}

methods.do = function(activity) {
  for(var i in this.activitys.toObject()) {
    if(this.activitys[i].code == activity.toLowerCase())
      return true;
  }
  return false;
}

methods.doAny = function(doActivitys) {
  if(!(doActivitys instanceof Array)) {
    doActivitys = [doActivitys];
  }

  for(var i in doActivitys) {
    for(var y in this.activitys.toObject()) {
      if(this.activitys[y].code == doActivitys[i].toLowerCase())
        return true;
    }
  }
  return false;
}

methods.doAll = function(doActivitys) {
  if(!(doActivitys instanceof Array)) {
    doActivitys = [doActivitys];
  }
  var doIt = false;
  for(var i in doActivitys) {
    doIt = false;
    for(var y in this.activitys.toObject()) {
      if(this.activitys[y].code == doActivitys[i].toLowerCase()) {
        doIt = true;
        break;
      }
    }
    if(!doIt)
      return false;
  }
  return doIt;
}

var User = function(di) {
  $i = di;
  
  $i.schemas.user.mongoose.pre('save', function(next) {
    this.updatedat = new Date;
    if(!this.createdat)
      this.createdat = new Date;
    if (!this.isModified('password')) 
      return next();
    this.password = statics.hashPassword(this.password);
    next();
  });

  $i.schemas.user.mongoose.methods = methods;
  $i.schemas.user.mongoose.statics = statics;
  return $i.mongoose.model("User", $i.schemas.user.mongoose, "user");
};

module.exports = exports = User;