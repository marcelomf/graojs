var models, controllers, event, passport, Strategy, hash, __;
var service = {};

service.login = function(req, res, next) {
  //console.log('postlogin');
  passport.authenticate('local', function(err, user) {
    if(err || !user) 
      return res.json(event.new(__("Access Denied.")).error().log('error').toJson());

    req.logIn(user, function(err) {
      if(err) 
        return res.json(event.new(__("Access Denied.")).error().log('error').toJson());

      res.json(event.new(__("Welcome")).success().log('info').toJson());
    });
  })(req, res, next);
}

service.logout = function(req, res, next) {
  //console.log('logout');
  req.logout();
  res.json(event.new(__("Logout")).success().log('info').toJson());
}

service.checkAuth = function(req, res, next){
  //console.log('checkauth');
  if(req.isAuthenticated()) 
  	return next();
  
  res.json(event.new(__("Access Denied.")).error().log('error').toJson());
};

var PassportController = function(di) {
  __ = di.__;
  event = new di.event.new('Instance created').success().present().log('info');
  models = di.models;
  controllers = di.controllers;
  passport = di.passport;
  Strategy = di.Strategy;
  hash = di.hash;
  this.service = service;

  passport.serializeUser(function(user, done) {
    //console.log('serializa');
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    //console.log('deserializa');
    models.user.findOne({ _id: id }).populate('activitys').exec(function(err, user) {
      done(err, user);
    });
  });

  passport.use(new Strategy(function(username, password, done) {
    //console.log('strategy');
    models.user.findOne({ username: username, password: hash(password) }).
      populate('activitys').
      exec(function(err, user) {
      if(err) 
        return done(err);
      if(!user) 
        return done(null, false);
      if(user) 
        return done(null, user);
    });
  }));
};

module.exports = exports = PassportController;