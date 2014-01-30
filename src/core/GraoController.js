var GraoController = function(di) {
  di.event.new('Instance created').success().present().log('info');
  di.controllers = this;

  this.filterRequest = function(model, filterData){
    var filter = null;
    var realyFilter = false;
    filter = JSON.parse(filterData, function(key, value){
      if(key.length <= 0)
        return value;

      if(!(model.schema.paths[key] && typeof model.schema.paths[key] === 'object'))
        return null;

      if(model.schema.paths[key].instance == 'String')
      {
        if(value.length > 0)
        {
          realyFilter = true;
          return new RegExp('.*'+value+'.*', "i");
        }
        else
          return "";
      }
    });

    if(!realyFilter)
      filter = null;

    return filter;
  };

  di.controllers = di.loader.tryLoad(di.loader.loading('controller'), di, 'controllers');
};

module.exports = exports = GraoController;