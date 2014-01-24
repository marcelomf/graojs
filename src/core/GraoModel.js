var GraoModel = function(di) {
  di.event.newEvent('Database Connection....').success().present().log('info');
  di.mongoose.connect(di.config.db);
  di.event.newEvent('Instance created').success().present().log('info');
  di.models = this;
  di.models = di.loader.tryLoad(di.loader.loading('model'), di, 'models');
};

module.exports = exports = GraoModel;
