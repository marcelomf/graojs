var FrontendRoute = function (di) {

  di.graoExpress.get('/', function(req, res) {
    var locale = (di.config.locales.indexOf(req.cookies.locale) >= 0) ? req.cookies.locale : di.config.defaultLocale;
    res.render('frontend/view/index', {isAuth: req.isAuthenticated(), locale: locale, user: req.user});
  });

  di.graoExpress.get('/locale/:locale', function (req, res) {
    res.setLocale(req.params.locale);
    res.cookie('locale', req.params.locale);
    res.redirect("/");
  });
};

module.exports = exports = FrontendRoute;