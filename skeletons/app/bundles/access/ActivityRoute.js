var ActivityRoute = function(di) {
  di.graoExpress.get('/service/activity/count',
    di.controllers.passport.service.validateJson,
  	di.controllers.activity.service.count);
  di.graoExpress.get('/service/activity/:id',
    di.controllers.passport.service.validateJson,
  	di.controllers.activity.service.get);
  di.graoExpress.put('/service/activity/:id',
    di.controllers.passport.service.validateJson,
  	di.controllers.activity.service.validate, 
    di.controllers.activity.service.update);
  di.graoExpress.del('/service/activity/:id',
    di.controllers.passport.service.validateJson,
  	di.controllers.activity.service.destroy);
  di.graoExpress.get('/service/activity', 
    di.controllers.passport.service.validateJson,
  	di.controllers.activity.service.query);
  di.graoExpress.post('/service/activity/validate', 
    di.controllers.passport.service.validateJson,
  	di.controllers.activity.service.validate, 
  	function(req, res){ 
  	  res.json(di.event.newSuccess("Successful validation!").toJson()); 
    });
  di.graoExpress.post('/service/activity',
    di.controllers.passport.service.validateJson, 
  	di.controllers.activity.service.validate, 
  	di.controllers.activity.service.create);
  di.graoExpress.get('/admin/activity', 
    di.controllers.passport.service.validateTpl,
  	di.controllers.activity.admin.dashboard);
};

module.exports = exports = ActivityRoute;