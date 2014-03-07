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

  di.graoExpress.post('/login', di.controllers.passport.service.login);
  di.graoExpress.get('/logout', di.controllers.passport.service.logout);
};

module.exports = exports = FrontendRoute;