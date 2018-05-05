var methods = {}, statics = {}, $i;

statics.sendNewPassword = function(username, password, email) {
  var def = $i.Q.defer();
  var smtpTransport = $i.nodemailer.createTransport($i.config.smtpOptions, 
    { from: "Contact <"+$i.config.smtpOptions.auth.user+">" });

  var body = "Username: "+username+"\n";
  body += "Password: "+password+"\n";

  var mailOptions = {
    from: $i.config.smtpOptions.auth.user,
    to: email, // list of receivers
    subject: i18n.__("New password"), // Subject line
    text: body, // plaintext body
    html: body // html body
  };

  smtpTransport.sendMail(mailOptions, function(err, response){
    if(err){
      console.log("Email not sended: "+err);
      def.reject(new Error(err));
    } else { 
      def.resolve(true);
    }
    smtpTransport.close();
  });

  return def.promise;
}

statics.randPasswordAndSaveAndMail = function(user, sendMail) {
  var def = $i.Q.defer();

  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var passwordLength = 8;
  var randomPass = '';
  for (var i=0; i < passwordLength; i++) {
    var num = Math.floor(Math.random() * chars.length);
    randomPass += chars.substring(num, num+1);
  }

  user.password = randomPass;
  user.save(function(err, user){
    if(err) return def.reject(new Error(err));
    if(sendMail == true) {
      statics.sendNewPassword(user.username, randomPass, user.email).then(function(status){
        def.resolve(user);
      }).catch(function(err){
        def.reject(new Error(err));
      });
    } else {
      def.resolve(user);
    }
  });
  return def.promise;
}

statics.hashPassword = function(password) {
  return $i.hash(password);
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