var FrontendRoute = function (di) {
  di.graoExpress.get('/', function(req, res) {
    var locale = (['pt-br', 'es', 'en'].indexOf(req.cookies.locale) >= 0) ? req.cookies.locale : 'en';
    res.render('frontend/view/index', {isAuth: req.isAuthenticated(), locale: locale});
  });

  di.graoExpress.get('/locale/:locale', function (req, res) {
    res.setLocale(req.params.locale);
    res.cookie('locale', req.params.locale);
    res.redirect("/");
  });

  di.graoExpress.post('/login', di.graoPassport.postLogin);

  di.graoExpress.get('/logout', di.graoPassport.logout);

};

module.exports = exports = FrontendRoute;