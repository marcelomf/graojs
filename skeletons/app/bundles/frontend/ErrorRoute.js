var ErrorRoute = function (di) {
  di.graoExpress.use(function(req, res, next){
    var event = di.event.new(res.__('Not Found')+': '+req.url).error().log('warn');
    res.status(404);
    if(req.accepts('html')){
      res.render('frontend/theme/404', { url: req.url });
      return;
    }

    if(req.accepts('json')){
      res.json(event.toJson());
      return;
    }

    res.type('txt').send(res.__('Not Found')+': '+req.url);
  });

  di.graoExpress.use(function(err, req, res, next){
    if(err) {
      var event = di.event.new(err.stack).error().log('error');
    }
    res.status(err.status || 500);
    res.render('frontend/theme/500', { error: err });
  });
};

module.exports = exports = ErrorRoute;