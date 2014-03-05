graoJS = angular.module('graoJS', ['ngResource', 'ui.bootstrap', 'ui.select2']);
graoJS.constant("config", {
  baseUrl: window.location.protocol+"//"+
    window.location.hostname+":"+
    window.location.port+"\:"+
    window.location.port
});

function clearObject(obj){
  for (var o in obj) {
    if (isNaN(parseInt(o))) {
      clearObject(obj[o]);
      if(typeof obj[o] == 'string')
        obj[o] = '';
      else if(typeof obj[o] == 'number' || typeof obj[o] == 'boolean')
        obj[o] = null;
      else if(obj[o] instanceof Array)
        obj[o] = new Array();
    }
  }
}

function validate(alert, errorObject, responseData, pathsIgnore){
  if(!pathsIgnore)
    pathsIgnore = new Array();

  function jumpPath(errorObject, paths, value) {
    var newPath = paths[0];
    paths.shift();
    if(!errorObject[newPath])
      errorObject[newPath] = {};

    if(paths.length == 0)
      errorObject[newPath] = value;
    else
      jumpPath(errorObject[newPath], paths, value);
  }

  clearObject(errorObject);
  var errors = responseData.data;
  for(var iField in errors){
    if(pathsIgnore.indexOf(errors[iField].path) >= 0)
      delete errors[iField];
  }
  var count = 0;
  for(var iField in errors) count++;
  if(count <= 0) return true;

  if(responseData.event && responseData.event.status == false) {
    alert.show = true;
    alert.style = responseData.event.style;
    alert.message = responseData.event.message;
    for(var iField in errors){
      if(errors[iField].path.indexOf('.') != -1)
        jumpPath(errorObject, errors[iField].path.split('.'), errors[iField].message);
      else if(typeof errorObject[errors[iField].path] != 'object') // else ?
        errorObject[errors[iField].path] = errors[iField].message;
    }
    return false;
  }
  return true;
}

var DataList = function() {
  var self = this;
  this.data = [];
  this.filter = null;
  this.sort = { field: '_id', type: '-'};
  this.page = { skip: 0, limit: 10, current: 1 };
  this.status = { totality: 0, filtered: 0, listing: 0 };

  this.toParams = function(){
    for(var k in this.filter) {
      if(this.filter[k] == null || this.filter[k] == "")
        delete this.filter[k];
    }
    return { 
      filter: JSON.stringify(this.filter),
      sort: JSON.stringify(this.sort),
      page: JSON.stringify(this.page),
      status: JSON.stringify(this.status)
     };
  }

  this.sortClass = function(fieldName){
    if(this.sort.field == fieldName && this.sort.type == '+')
      return 'sorting_asc';
    else if(this.sort.field == fieldName && this.sort.type == '-')
      return 'sorting_desc';
    else
      return 'sorting';
  }

  this.sortBy = function(fieldName){
    this.sort.field = fieldName; 
    this.sort.type = (this.sort.type == '+') ? '-' : '+';
  }
}