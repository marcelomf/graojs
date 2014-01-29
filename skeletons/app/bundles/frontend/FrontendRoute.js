var FrontendRoute = function (di) {
	di.graoExpress.get('/', function(req, res) {
		res.render('frontend/view/index', {isAuth: req.isAuthenticated()});
	});

  di.graoExpress.get('/events/pull', function(req, res){
    res.jsonp(di.event.listener.push());
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