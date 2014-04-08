var methods = {}, statics = {}, $i;

methods.randPassword = function() {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var passwordLength = 8;
  var randomPass = '';
  for (var i=0; i < passwordLength; i++) {
    var num = Math.floor(Math.random() * chars.length);
    randomPass += chars.substring(num, num+1);
  }
  return this.password = randomPass;
}

methods.hashPassword = function() {
  return this.password = $i.hash(this.password);
}

methods.confirmPassword = function(cleanPassword) {
  var oldHashPassword = this.password;
  this.password = cleanPassword;
  if(this.hashPassword() == oldHashPassword)
  	return true;
  
  this.password = oldHashPassword;
  return false;
}

methods.do = function(activity) {
  for(i in this.activitys) {
    if(this.activitys[i].code == activity.toLowerCase())
      return true;
  }
  return false;
}

methods.doAny = function(doActivitys) {
  if(!(doActivitys instanceof Array)) {
    doActivitys = [doActivitys];
  }

  for(i in doActivitys) {
    for(y in this.activitys) {
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
  for(i in doActivitys) {
    doIt = false;
    for(y in this.activitys) {
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
  $i.schemas.user.mongoose.methods = methods;
  $i.schemas.user.mongoose.statics = statics;

  $i.schemas.user.mongoose.pre('save', function(next) {
    this.updatedAt = new Date();
    if(!this.createdAt)
      this.createdAt = new Date();
    if (!this.isModified('password')) 
      return next();
    this.password = $i.hash(this.password);
    next();
  });

  return $i.mongoose.model("User", $i.schemas.user.mongoose, "user");
};

module.exports = exports = User;