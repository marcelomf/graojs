var service = {}, admin = {}, models, controllers, event, config, User, nodemailer, $i;

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
    User.findOne({_id : req.params.id}, "_id username email enabled createdat updatedat activitys").populate('activitys').exec(function(err, user) {
    if (err)
      res.json(event.newError(err).toJson());
    else
      res.json(user);
  });
}

service.query = function(req, res) {
  var dataList = controllers.processDataList(User, req.query);

  User.find(dataList.filter, "_id username email enabled createdat updatedat activitys").
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
  req.body.password = 'byPasssssss';
  var user = new User(req.body);
  user.validate(function(err){
    if(err)
      res.json(event.newError(err).toJson());
    else
      next();
  });
}

service.sendNewPassword = function(user, res) {
  var smtpTransport = nodemailer.createTransport("SMTP", config.smtpOptions);

  var body = "Username: "+user.username+"\n";
  body += "Password: "+user.password+"\n";

  event.newSuccess(body);

  var mailOptions = {
    from: "Hostmaster <hostmaster@synack.com.br>", // sender address
    to: "marcelomf@gmail.com, marcelo@synack.com.br", // list of receivers
    subject: config.name+" - "+res.__("New password"), // Subject line
    text: body, // plaintext body
    html: body // html body
  };

  smtpTransport.sendMail(mailOptions, function(err, response){
    if(err){
      event.newError(err);
    }else{
      event.newSuccess("Message sent: " + response.message);
    }
    smtpTransport.close();
  });

}

service.create = function(req, res) {
  var user = new User(req.body);
  var randomPassword = user.randPassword();
  user.save(function(err, user) {
    if(err)
      return res.json(event.newError(err).toJson());
    
    res.json(event.newSuccess(res.__("User")+" "+res.__("created")).data(user).toJson());
    if(randomPassword) {
      user.password = randomPassword;
      service.sendNewPassword(user, res);
    }
  });
}

service.update = function(req, res) {
  delete req.body._id;
  delete req.body.password;
  if(req.body.generatePassword == true) {
    var user = new User(req.body);
    var randomPassword = user.randPassword();
    service.sendNewPassword(user, res);
    req.body.password = user.hashPassword();
    delete user;
  }
  User.findOneAndUpdate({_id : req.params.id }, req.body, { upsert : true }, function(err, user) {
    if(err)
      return res.json(event.newError(err).toJson());
    
    res.json(event.newSuccess(res.__("User") +" "+res.__("updated")).data(user).toJson());
    if(randomPassword) {
      user.password = randomPassword;
      service.sendNewPassword(user, res);
    }
  });
}

service.updateProfile = function(req, res) {

  function save(user) {
    user.username = req.body.username;
    user.email = req.body.email;
    user.validate(function(err){
      if(err) {
        if(err.errors && err.errors && err.errors.password) {
          err.errors.newPassword = err.errors.password;
          err.errors.newPassword.path = 'newPassword';
        }
        return res.json(event.newError(err).toJson());
      }
      user.save(function(err){
        if(err)
          return res.json(event.newError(err).toJson());

        user.password = '';
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
  nodemailer = $i.nodemailer;
  User = models.user; // object/class
  this.service = service;
  this.admin = admin;
};

module.exports = exports = UserController;