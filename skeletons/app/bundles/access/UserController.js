var service = {}, admin = {}, helper = {}, models, controllers, event, config, User, $i;

service.count = function(req, res) {
  var dataList = controllers.processDataList(User, req.query);

  User.count({}, function(err, totality) {
    if(err) {
      res.json(event.newError(err).toJson());
      return;
    } 

    if(dataList.filter == null) {
      res.json({totality: totality, filtered: 0});
      return;
    }

    User.count(dataList.filter, function(err, filtered) {
      if(err)
        res.json(event.newError(err).toJson());
      else
        res.json({totality: totality, filtered: filtered});
    });
  });
}

service.get = function(req, res) {
    User.findOne({_id : req.params.id}, "-password").populate('activitys').exec(function(err, user) {
    if (err)
      res.json(event.newError(err).toJson());
    else
      res.json(user);
  });
}

service.query = function(req, res) {
  var dataList = controllers.processDataList(User, req.query);

  User.find(dataList.filter, "-password").
    sort(dataList.sort).
    skip(dataList.page.skip).
    limit(dataList.page.limit).
    populate('user').
    populate('activitys').
    exec(function(err, users) {
      if(err)
        res.json(event.newError(err).toJson());
      else
        res.json(users);
  });
}

service.validate = function(req, res, next) {
  req.body.password = 'byPass12321';
  var user = new User(req.body);
  user.validate(function(err){
    if(err)
      res.json(event.newError(err).toJson());
    else
      next();
  });
}

helper.fixError = function(err) {
  if(err) {
    if(err.errors && err.errors && err.errors.password) {
      err.errors.newPassword = err.errors.password;
      err.errors.newPassword.path = 'newPassword';
    }
  }
  return err;
}

service.create = function(req, res) {
  if(req.body.newPassword != req.body.confirmNewPassword)
    return res.json(event.newError(res.__('Error in the password confirmation.')).toJson());

  req.body.password = req.body.newPassword;
  delete req.body.newPassword;
  delete req.body.confirmNewPassword;

  User.buildActivitys(req.body)
  .then(function(userJson){
    var user = new User(userJson);
    user.save(function(err, user){
      if(err){
        err = helper.fixError(err);
        return res.json(event.newError(err).toJson());
      } 
      delete user.password;
      res.json(event.newSuccess(res.__("User")+" "+res.__("created")).data(user).toJson());
    });
  }).catch(function(err){
    res.json(event.newError(err).toJson());
  });
}

service.update = function(req, res) {
  function save(userJson){
    var userId = userJson._id;
    delete userJson._id;
    User.findOneAndUpdate({_id : userId }, userJson, function(err, user) {
      if(err) return res.json(event.newError(err).toJson());
      delete user.password;
      res.json(event.newSuccess(res.__("User")+" "+res.__("updated")).data(user).toJson());
    });
  }

  if(req.body.newPassword != req.body.confirmNewPassword)
    return res.json(event.newError(res.__('Error in the password confirmation.')).toJson());

  req.body.password = req.body.newPassword;
  req.body._id = req.params.id;
  delete req.body.newPassword;
  delete req.body.confirmNewPassword;
  
  User.buildActivitys(req.body)
  .then(function(userJson){
    if(userJson.password && userJson.password.length > 0){
      testNewUser = new User(userJson);
      testNewUser.validate(function(err){
        if(err) {
          err = helper.fixError(err);
          return res.json(event.newError(err).toJson());
        } 
        userJson.password = User.hashPassword(userJson.password);
        save(userJson);  
      });
    } else {
      delete userJson.password;
      save(userJson);
    }
  }).catch(function(err){
    res.json(event.newError(err).toJson());
  });
}

service.updateProfile = function(req, res) {

  function save(user) {
    delete req.body.password;
    delete req.body.newPassword;
    delete req.body.confirmPassword;
    delete req.body.currentPassword;
    for(var field in req.body){
      user[field] = req.body[field];
    }

    user.validate(function(err){
      if(err) {
        err = helper.fixError(err);
        return res.json(event.newError(err).toJson());
      }
      user.save(function(err, user){
        if(err)
          return res.json(event.newError(err).toJson());

        delete user.password;
        req.user = user;
        return res.json(event.newSuccess(res.__("User profile updated")).toJson());
      });
    });
  }

  if(!req.user || !req.user._id)
    return res.json(event.newError(res.__('Access Denied.')).toJson());

  if(req.body.newPassword != req.body.confirmNewPassword)
    return res.json(event.newError(res.__('Error in the password confirmation.')).toJson());

  if(req.body.currentPassword && req.body.currentPassword.length > 0) {
    User.findOne({_id: req.user._id}, function(err, userSession){
      if(err)
        return res.json(event.newError(err).toJson());

      if(!userSession.confirmPassword(req.body.currentPassword))
        return res.json(event.newError(res.__('Invalid current password.')).toJson());

      userSession.password = req.body.newPassword;
      userSession.markModified('password');
      save(userSession);
    });
  } else {
    save(req.user);
  }
}

service.destroy = function(req, res) {  
  User.remove({_id : req.params.id}, function(err) {
    if(err)
      res.json(event.newError(err).toJson());
    else
      res.json(event.newSuccess(res.__("Destroyed")).toJson());
  });
}

admin.dashboard = function(req, res) {
  var locale = (config.locales.indexOf(req.cookies.locale) >= 0) ? req.cookies.locale : config.defaultLocale;
  res.render('access/view/user_dashboard', { isAuth: req.isAuthenticated(), 
                                             locale: locale, 
                                             user: req.user });
}

admin.profile = function(req, res) {
  var locale = (config.locales.indexOf(req.cookies.locale) >= 0) ? req.cookies.locale : config.defaultLocale;
  res.render('access/view/user_profile', { isAuth: req.isAuthenticated(), 
                                             locale: locale, 
                                             user: req.user });
}

var UserController = function(di) {
  $i = di;
  event = new $i.event.newSuccess('Instance created');
  config = $i.config;
  models = $i.models;
  controllers = $i.controllers;
  User = models.user; // object/class
  this.service = service;
  this.admin = admin;
};

module.exports = exports = UserController;