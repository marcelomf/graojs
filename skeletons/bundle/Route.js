var {{ schema | capitalize }}Route = function(di) {
  di.graoExpress.get('/{{ schema | lower }}/count',
    di.controllers.access.service.validateJson, 
  	di.controllers.{{ schema | lower }}.service.count);
  di.graoExpress.get('/{{ schema | lower }}/:id', 
    di.controllers.access.service.validateJson,
  	di.controllers.{{ schema | lower }}.service.get);
  di.graoExpress.put('/{{ schema | lower }}/:id', 
    di.controllers.access.service.validateJson,
  	di.controllers.{{ schema | lower }}.service.validate, 
    di.controllers.{{ schema | lower }}.service.update);
  di.graoExpress.del('/{{ schema | lower }}/:id', 
    di.controllers.access.service.validateJson,
  	di.controllers.{{ schema | lower }}.service.destroy);
  di.graoExpress.get('/{{ schema | lower }}', 
    di.controllers.access.service.validateJson,
  	di.controllers.{{ schema | lower }}.service.query);
  di.graoExpress.post('/{{ schema | lower }}/validate', 
    di.controllers.access.service.validateJson,
  	di.controllers.{{ schema | lower }}.service.validate, 
  	function(req, res){ 
  	  res.json(di.event.newSuccess("Successful validation!").toJson()); 
    });
  di.graoExpress.post('/{{ schema | lower }}', 
    di.controllers.access.service.validateJson,
  	di.controllers.{{ schema | lower }}.service.validate, 
  	di.controllers.{{ schema | lower }}.service.create);
  di.graoExpress.get('/admin/{{ schema | lower }}', 
    di.controllers.access.service.validateTpl,
  	di.controllers.{{ schema | lower }}.admin.dashboard);
};

module.exports = exports = {{ schema | capitalize }}Route;