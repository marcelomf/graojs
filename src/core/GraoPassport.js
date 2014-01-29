var LocalStrategy = require('passport-local').Strategy;

var GraoPassport = function(di) {
  di.event.newEvent('Passport....').success().present().log('info');

  di.passport.serializeUser(function(user, done) {
    console.log('serializa');
    done(null, user.username);
  });

  di.passport.deserializeUser(function(username, done) {
    console.log('deserializa');
    di.models.user.findOne({ username: username }, function (err, user) {
      done(err, user);
    });
  });

  di.passport.use(new LocalStrategy(function(username, password, done) {
    console.log('strategy');
    di.models.user.findOne({ username: username, password: password }, function (err, user) {
      if(err) 
        return done(err);
      if(!user) 
        return done(null, false);
      if(user) 
        return done(null, user);
    });
  }));

  this.postLogin = function(req, res, next) {
    console.log('postlogin');
    di.passport.authenticate('local', function(err, user) {
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

  this.logout = function(req, res, next) {
    console.log('logout');
    req.logout();
    res.send({statusLogout: true});
  }

  this.checkAuth = function(req, res, next){
    console.log('checkauth');
    if(req.isAuthenticated()) return next();
    res.send({statusLogin: false, mensage: "Access Denied."});
  };

};

module.exports = exports = GraoPassport;