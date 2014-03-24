var $i;
var {{ schema | capitalize }}Route = function(di) {
  $i = di;
  $i.graoExpress.get('/service/{{ schema | lower }}/count',
    $i.controllers.passport.service.validateJson, 
  	$i.controllers.{{ schema | lower }}.service.count);
  $i.graoExpress.get('/service/{{ schema | lower }}/:id', 
    $i.controllers.passport.service.validateJson,
  	$i.controllers.{{ schema | lower }}.service.get);
  $i.graoExpress.put('/service/{{ schema | lower }}/:id', 
    $i.controllers.passport.service.validateJson,
  	$i.controllers.{{ schema | lower }}.service.validate, 
    $i.controllers.{{ schema | lower }}.service.update);
  $i.graoExpress.del('/service/{{ schema | lower }}/:id', 
    $i.controllers.passport.service.validateJson,
  	$i.controllers.{{ schema | lower }}.service.destroy);
  $i.graoExpress.get('/service/{{ schema | lower }}', 
    $i.controllers.passport.service.validateJson,
  	$i.controllers.{{ schema | lower }}.service.query);
  $i.graoExpress.post('/service/{{ schema | lower }}/validate', 
    $i.controllers.passport.service.validateJson,
  	$i.controllers.{{ schema | lower }}.service.validate, 
  	function(req, res){ 
  	  res.json($i.event.newSuccess("Successful validation!").toJson()); 
    });
  $i.graoExpress.post('/service/{{ schema | lower }}', 
    $i.controllers.passport.service.validateJson,
  	$i.controllers.{{ schema | lower }}.service.validate, 
  	$i.controllers.{{ schema | lower }}.service.create);
  $i.graoExpress.get('/admin/{{ schema | lower }}', 
    $i.controllers.passport.service.validateTpl,
  	$i.controllers.{{ schema | lower }}.admin.dashboard);
};

module.exports = exports = {{ schema | capitalize }}Route;