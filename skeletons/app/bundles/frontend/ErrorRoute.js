var ErrorRoute = function (di) {
  di.graoExpress.use(function(err, req, res, next){
    if(err) {
      var event = di.event.new(err.stack).error().log('error');
    }
    res.status(err.status || 500);
    res.render('frontend/theme/500', { error: err });
  });
};

module.exports = exports = ErrorRoute;