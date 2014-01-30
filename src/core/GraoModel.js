var GraoModel = function(di) {
  di.event.new('Database Connection....').success().present().log('info');
  di.mongoose.connect(di.config.db);
  di.event.new('Instance created').success().present().log('info');
  di.models = this;
  di.models = di.loader.tryLoad(di.loader.loading('model'), di, 'models');
};

module.exports = exports = GraoModel;
