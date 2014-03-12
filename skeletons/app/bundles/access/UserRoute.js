var UserRoute = function(di) {
  di.graoExpress.get('/user/count',
    di.controllers.passport.service.validateJson,
  	di.controllers.user.service.count);
  di.graoExpress.get('/user/:id',
    di.controllers.passport.service.validateJson,
  	di.controllers.user.service.get);
  di.graoExpress.put('/user/:id',
    di.controllers.passport.service.validateJson,
  	di.controllers.user.service.validate, 
    di.controllers.user.service.update);
  di.graoExpress.del('/user/:id',
    di.controllers.passport.service.validateJson,
  	di.controllers.user.service.destroy);
  di.graoExpress.get('/user',
    di.controllers.passport.service.validateJson,
  	di.controllers.user.service.query);
  di.graoExpress.post('/user/validate',
    di.controllers.passport.service.validateJson, 
  	di.controllers.user.service.validate, 
  	function(req, res){ 
  	  res.json(di.event.newSuccess("Successful validation!").toJson()); 
    });
  di.graoExpress.post('/user', 
    di.controllers.passport.service.validateJson, 
  	di.controllers.user.service.validate, 
  	di.controllers.user.service.create);
  di.graoExpress.get('/admin/user',
    di.controllers.passport.service.validateTpl, 
  	di.controllers.user.admin.dashboard);
  di.graoExpress.get('/u/:username',
    di.controllers.passport.service.validateTpl, 
    di.controllers.user.admin.profile);
  di.graoExpress.put('/user/update/profile',
    di.controllers.passport.service.validateJson,
    di.controllers.user.service.updateProfile);
  di.graoExpress.post('/login', 
    di.controllers.passport.service.login);
  di.graoExpress.get('/logout', 
    di.controllers.passport.service.logout);
};

module.exports = exports = UserRoute;