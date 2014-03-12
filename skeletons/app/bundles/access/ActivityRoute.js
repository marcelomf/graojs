var ActivityRoute = function(di) {
  di.graoExpress.get('/activity/count',
    di.controllers.passport.service.validateJson,
  	di.controllers.activity.service.count);
  di.graoExpress.get('/activity/:id',
    di.controllers.passport.service.validateJson,
  	di.controllers.activity.service.get);
  di.graoExpress.put('/activity/:id',
    di.controllers.passport.service.validateJson,
  	di.controllers.activity.service.validate, 
    di.controllers.activity.service.update);
  di.graoExpress.del('/activity/:id',
    di.controllers.passport.service.validateJson,
  	di.controllers.activity.service.destroy);
  di.graoExpress.get('/activity', 
    di.controllers.passport.service.validateJson,
  	di.controllers.activity.service.query);
  di.graoExpress.post('/activity/validate', 
    di.controllers.passport.service.validateJson,
  	di.controllers.activity.service.validate, 
  	function(req, res){ 
  	  res.json(di.event.newSuccess("Successful validation!").toJson()); 
    });
  di.graoExpress.post('/activity',
    di.controllers.passport.service.validateJson, 
  	di.controllers.activity.service.validate, 
  	di.controllers.activity.service.create);
  di.graoExpress.get('/admin/activity', 
    di.controllers.passport.service.validateTpl,
  	di.controllers.activity.admin.dashboard);
};

module.exports = exports = ActivityRoute;