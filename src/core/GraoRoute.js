var GraoRoute = function(di) {
  di.event.new('Setting routes of controllers...').success().present().log('info');
  di.routes = this;
  di.routes = di.loader.tryLoad(di.loader.loading('route'), di, 'routes');
};

module.exports = exports = GraoRoute;
