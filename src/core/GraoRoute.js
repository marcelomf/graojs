var GraoRoute = function(di) {
  di.event.newSuccess('Setting routes of controllers...');
  di.routes = this;
  di.routes = di.loader.tryLoad(di.loader.loading('route'), di, 'routes');
};

module.exports = exports = GraoRoute;
