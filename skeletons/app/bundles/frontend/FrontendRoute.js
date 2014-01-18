var FrontendRoute = function (di) {

  di.graoExpress.get('/', function(req, res) {

    {% if template_engine == 'jade' %}
      res.render('frontend/view/index');
    {% elseif template_engine == 'swig' %}
      res.render('frontend/view/index.html');
    {% else %}
      // TODO Error
    {% endif %}

  });

  di.graoExpress.get('/events/pull', function(req, res){
    res.jsonp(di.event.listener.push());
  });

  di.graoExpress.get('/locale/:locale', function (req, res) {
    res.cookie('locale', req.params.locale);
    res.setLocale(req.params.locale);
    console.log('Locale: '+res.getLocale()+' - '+res.__('12345'));
    res.redirect("/");
  });

};

module.exports = exports = FrontendRoute;
