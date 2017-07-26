var $i;
var UserRoute = function(di) {
  $i = di;
  $i.graoExpress.get('/service/user/count',
    $i.controllers.passport.service.validateJson, 
    $i.controllers.user.service.count);
  $i.graoExpress.get('/service/user/:id', 
    $i.controllers.passport.service.validateJson,
    $i.controllers.user.service.get);
  $i.graoExpress.put('/service/user/:id', 
    $i.controllers.passport.service.validateJson,
    $i.controllers.user.service.validate, 
    $i.controllers.user.service.update);
  $i.graoExpress.delete('/service/user/:id', 
    $i.controllers.passport.service.validateJson,
    $i.controllers.user.service.destroy);
  $i.graoExpress.get('/service/user', 
    $i.controllers.passport.service.validateJson,
    $i.controllers.user.service.query);
  $i.graoExpress.post('/service/user/validate', 
    $i.controllers.passport.service.validateJson,
    $i.controllers.user.service.validate, 
    function(req, res){ 
      res.json($i.event.newSuccess("Successful validation!").toJson()); 
    });
  $i.graoExpress.post('/service/user', 
    $i.controllers.passport.service.validateJson,
    $i.controllers.user.service.validate, 
    $i.controllers.user.service.create);
  $i.graoExpress.get('/admin/user', 
    $i.controllers.passport.service.validateTpl,
    $i.controllers.user.admin.dashboard);
  $i.graoExpress.get('/u/:username',
    $i.controllers.passport.service.validateTpl, 
    $i.controllers.user.admin.profile);
  $i.graoExpress.put('/service/user/update/profile',
    $i.controllers.passport.service.validateJson,
    $i.controllers.user.service.updateProfile);
  $i.graoExpress.post('/service/login', 
    $i.controllers.passport.service.login);
  $i.graoExpress.get('/service/logout', 
    $i.controllers.passport.service.logout);
};

module.exports = exports = UserRoute;