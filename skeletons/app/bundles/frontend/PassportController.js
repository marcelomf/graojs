var models, controllers, event, passport, Strategy;
var service = {};

passport.serializeUser(function(user, done) {
  console.log('serializa');
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  console.log('deserializa');
  models.user.findOne({ username: username }, function (err, user) {
    done(err, user);
  });
});

passport.use(new Strategy(function(username, password, done) {
  console.log('strategy');
  models.user.findOne({ username: username, password: password }, function (err, user) {
    if(err) 
      return done(err);
    if(!user) 
      return done(null, false);
    if(user) 
      return done(null, user);
  });
}));

service.login = function(req, res, next) {
  console.log('postlogin');
  passport.authenticate('local', function(err, user) {
    if(err) 
      return res.send({statusLogin: false, mensage: "Error: "+err}); // FIXME, not present real error!
    if(!user) 
      return res.send({statusLogin: false, mensage: "Invalid User."});
    req.logIn(user, function(err) {
      if(err) 
        return res.send({statusLogin: false, mensage: "Error: "+err}); // FIXME, not present real error!
      return res.send({statusLogin: true, mensage: "Success."});
    });
  })(req, res, next);
}

service.logout = function(req, res, next) {
  console.log('logout');
  req.logout();
  res.send({statusLogout: true});
}

service.checkAuth = function(req, res, next){
  console.log('checkauth');
  if(req.isAuthenticated()) 
  	return next();
  res.send({statusLogin: false, mensage: "Access Denied."});
};

var PassportController = function(di) {
  event = new di.event.new('Instance created').success().present().log('info');
  models = di.models;
  controllers = di.controllers;
  passport = di.passport;
  Strategy = di.Strategy;
  this.service = service;
};

module.exports = exports = PassportController;