var GraoSchema = function(di) {
  di.event.new('Instance created').success().present().log('info');
  di.schemas = this;
  di.schemas = di.loader.tryLoad(di.loader.loading('schema'), di, 'schemas');
};

module.exports = exports = GraoSchema;