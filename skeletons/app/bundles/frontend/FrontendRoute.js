var FrontendRoute = function (di) {
  di.graoExpress.get('/', function(req, res) {
    var locale = (di.config.locales.indexOf(req.cookies.locale) >= 0) ? req.cookies.locale : di.config.defaultLocale;
    res.render('frontend/view/index', {isAuth: req.isAuthenticated(), locale: locale});
  });

  di.graoExpress.get('/locale/:locale', function (req, res) {
    res.setLocale(req.params.locale);
    res.cookie('locale', req.params.locale);
    res.redirect("/");
  });

  di.graoExpress.use(function(req, res, next){
    res.status(404);
    if (req.accepts('html')) {
      res.render('frontend/theme/404', { url: req.url });
      return;
    }

    if (req.accepts('json')) {
      res.json(event.new('Not Found...').error().log('error').toJson());
      return;
    }

    res.type('txt').send('Not found');
  });

  di.graoExpress.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.render('frontend/theme/500', { error: err });
  });

  di.graoExpress.post('/login', di.controllers.passport.service.login);
  di.graoExpress.get('/logout', di.controllers.passport.service.logout);
};

module.exports = exports = FrontendRoute;