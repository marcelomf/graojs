var GraoModel = function(di) {
  di.event.newSuccess('Database Connection....');
  //di.mongoose.connect(di.config.db);
  di.mongoose.connect(di.config.db, {useMongoClient: true});
  di.event.newSuccess('Instance created');
  di.models = this;
  di.models = di.loader.tryLoad(di.loader.loading('model'), di, 'models');
};

module.exports = exports = GraoModel;
