var models, controllers, event, passport, Strategy;
var service = {};

service.login = function(req, res, next) {
  //console.log('postlogin');
  passport.authenticate('local', function(err, user) {
    if(err || !user) 
      return res.json(event.new(res.__("Access Denied.")).error().log('error').toJson());

    req.logIn(user, function(err) {
      if(err) 
        return res.json(event.new(res.__("Access Denied.")).error().log('error').toJson());

      res.json(event.new(res.__("Welcome")).success().log('info').toJson());
    });
  })(req, res, next);
}

service.logout = function(req, res, next) {
  //console.log('logout');
  req.logout();
  res.json(event.new(res.__("Logout")).success().log('info').toJson());
}

service.validateTpl = function(req, res, next) {
  var locale = ($i.config.locales.indexOf(req.cookies.locale) >= 0) ? req.cookies.locale : $i.config.defaultLocale;
  if(!req.isAuthenticated())
    return res.render('frontend/theme/500', { error: res.__("Access Denied."),
                                              isAuth: req.isAuthenticated(), 
                                              locale: locale, 
                                              user: req.user });
  next();
}

service.validateJson = function(req, res, next) {
  if(!req.isAuthenticated())
    return res.json(di.event.newError(res.__("Access Denied.")).toJson());

  next();
}

var PassportController = function(di) {
  $i = di;
  event = new di.event.new('Instance created').success().present().log('info');
  models = di.models;
  controllers = di.controllers;
  passport = di.passport;
  Strategy = di.Strategy;
  this.service = service;

  passport.serializeUser(function(user, done) {
    //console.log('serializa');
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    //console.log('deserializa');
    models.user.findOne({ _id: id }, "_id username email activitys enabled").populate('activitys').exec(function(err, user) {
      done(err, user);
    });
  });

  passport.use(new Strategy(function(username, password, done) {
    //console.log('strategy');
    models.user.findOne({ username: username, password: di.hash(password) }).
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