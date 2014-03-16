var GraoSchema = function(di) {
  di.event.newSuccess('Instance created');
  di.schemas = this;
  di.schemas = di.loader.tryLoad(di.loader.loading('schema'), di, 'schemas');
};

module.exports = exports = GraoSchema;