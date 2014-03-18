var {{ schema | capitalize }}Route = function(di) {
  di.graoExpress.get('/service/{{ schema | lower }}/count',
    di.controllers.passport.service.validateJson, 
  	di.controllers.{{ schema | lower }}.service.count);
  di.graoExpress.get('/service/{{ schema | lower }}/:id', 
    di.controllers.passport.service.validateJson,
  	di.controllers.{{ schema | lower }}.service.get);
  di.graoExpress.put('/service/{{ schema | lower }}/:id', 
    di.controllers.passport.service.validateJson,
  	di.controllers.{{ schema | lower }}.service.validate, 
    di.controllers.{{ schema | lower }}.service.update);
  di.graoExpress.del('/service/{{ schema | lower }}/:id', 
    di.controllers.passport.service.validateJson,
  	di.controllers.{{ schema | lower }}.service.destroy);
  di.graoExpress.get('/service/{{ schema | lower }}', 
    di.controllers.passport.service.validateJson,
  	di.controllers.{{ schema | lower }}.service.query);
  di.graoExpress.post('/service/{{ schema | lower }}/validate', 
    di.controllers.passport.service.validateJson,
  	di.controllers.{{ schema | lower }}.service.validate, 
  	function(req, res){ 
  	  res.json(di.event.newSuccess("Successful validation!").toJson()); 
    });
  di.graoExpress.post('/service/{{ schema | lower }}', 
    di.controllers.passport.service.validateJson,
  	di.controllers.{{ schema | lower }}.service.validate, 
  	di.controllers.{{ schema | lower }}.service.create);
  di.graoExpress.get('/admin/{{ schema | lower }}', 
    di.controllers.passport.service.validateTpl,
  	di.controllers.{{ schema | lower }}.admin.dashboard);
};

module.exports = exports = {{ schema | capitalize }}Route;