var models, controllers, event, passport, Strategy, $i;
var service = {};

service.login = function(req, res, next) {
  //console.log('postlogin');
  passport.authenticate('local', function(err, user) {
    if(err || !user) 
      return res.json(event.newError(res.__("Access Denied.")).toJson());

    req.logIn(user, function(err) {
      if(err) 
        return res.json(event.newError(res.__("Access Denied.")).toJson());

      res.cookie('accessid', user.accessId());
      res.json(event.newSuccess(res.__("Welcome")).toJson());
    });
  })(req, res, next);
}

service.logout = function(req, res, next) {
  res.clearCookie("connect.sid");
  res.clearCookie("accessid");
  req.logout();
  res.json(event.newSuccess(res.__("Logout")).toJson());
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
    return res.json(event.newError(res.__("Access Denied.")).toJson());

  next();
}

var PassportController = function(di) {
  $i = di;
  event = new di.event.newSuccess('Instance created');
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
    models.user.findOne({ _id: id }, "-password").populate('activitys').exec(function(err, user) {
      done(err, user);
    });
  });

  passport.use(new Strategy(function(username, password, done) {
    //console.log('strategy');
    models.user.findOne({ username: username, password: models.user.hashPassword(password), enabled: true }).
      populate('activitys').
      exec(function(err, user) {
      if(err) 
        return done(err);
      else if(!user) 
        return done(null, false);
      else
        return done(null, user);
    });
  }));
};

module.exports = exports = PassportController;
