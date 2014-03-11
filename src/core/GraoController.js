var GraoController = function(di) {
  di.event.newSuccess('Instance created');
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

    dataList.sort = "field "+(dataList.sort.type == '-' ? '-' : '')+dataList.sort.field;

    if(query.filter) {
      dataList.filter = JSON.parse(query.filter);
      for(var key in dataList.filter) {
        if(key.length <= 0)
          continue;

        if(!(model.schema.paths[key] && typeof model.schema.paths[key] === 'object'))
          continue;


        if(model.schema.paths[key].instance == 'String') {
          if(dataList.filter[key].length > 0) {
            dataList.filter[key] = RegExp('.*'+dataList.filter[key]+'.*', "i");
          }
          else
            dataList.filter[key] = "";
        } else if(model.schema.tree[key]) { // ref
          if(model.schema.tree[key] instanceof Array && model.schema.tree[key][0].ref) {
            dataList.filter[key] = { $in: dataList.filter[key] };
          } else if(model.schema.tree[key] && model.schema.tree[key].ref) {
            dataList.filter[key] = dataList.filter[key];
          }
        }
      }
    }

    return dataList;
  };

  di.controllers = di.loader.tryLoad(di.loader.loading('controller'), di, 'controllers');
};

module.exports = exports = GraoController;