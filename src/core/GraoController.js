var GraoController = function(di) {
  di.event.new('Instance created').success().present().log('info');
  di.controllers = this;

  this.processDataList = function(model, query){
    var dataList = { data: null,
                      filter: null,
                      sort: { field: '_id', type: '-'}, 
                      page: { skip: 0, limit: 10 }, 
                      status: { totality: 0, filtered: 0, listing: 0 } };
    if(query.data)
      dataList.data = JSON.parse(query.data);

    if(query.page)
      dataList.page = JSON.parse(query.page);

    if(query.status)
      dataList.status = JSON.parse(query.status);

    if(query.sort)
      dataList.sort = JSON.parse(query.sort);

    dataList.sort = "field "+dataList.sort.type+dataList.sort.field;

    if(query.filter) {
      var realyFilter = false;
      dataList.filter = JSON.parse(query.filter, function(key, value){
        if(key.length <= 0)
          return value;

        if(!(model.schema.paths[key] && typeof model.schema.paths[key] === 'object'))
          return null;

        if(model.schema.paths[key].instance == 'String') {
          if(value.length > 0) {
            realyFilter = true;
            return new RegExp('.*'+value+'.*', "i");
          }
          else
            return "";
        }
      });
    }  

    return dataList;
  };

  di.controllers = di.loader.tryLoad(di.loader.loading('controller'), di, 'controllers');
};

module.exports = exports = GraoController;