function {{ schema | capitalize }}PublicController($scope, $http, $q, share, {{ schema | lower }}{%- for key, ref in allRefs|uniq %}{%- if ref|lower != schema|lower %}, {{ ref | lower }}{%- endif %}{%- endfor %}) {
  $scope.share = share;
  $scope.{{ schema | lower }} = {};
  $scope.errors = {};
  $scope.errors.{{ schema | lower }} = {};
  $scope.notFilter = true;
  $scope.filter{{ schema | capitalize }} = {};
  $scope.statusData = { totality: 0, filtered: 0, listing: 0 };

  function clear(obj){
    for (var o in obj) {
      if (isNaN(parseInt(o))) {
        clear(obj[o]);
        if(typeof obj[o] == 'string')
          obj[o] = '';
        else if(typeof obj[o] == 'number' || typeof obj[o] == 'boolean')
          obj[o] = null;
        else if(obj[o] instanceof Array)
          obj[o] = new Array();
      }
    }
  }

  function validate(errorObject, responseData, pathsIgnore){
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

    clear(errorObject);
    var errors = responseData.data;
    for(var iField in errors){
      if(pathsIgnore.indexOf(errors[iField].path) >= 0)
        delete errors[iField];
    }
    var count = 0;
    for(var iField in errors) count++;
    if(count <= 0) return true;

    if(responseData.event && responseData.event.status == false) {
      share.alert.show = true;
      share.alert.style = responseData.event.style;
      share.alert.message = responseData.event.message;
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

  $scope.createOrUpdate = function(windowCallBack) {
    function save() {
      var {{ schema | lower }}Json = $scope.{{ schema | lower }};
{%- for fieldName, field in fields %}{%- if field.ref %}
{%- if field.isArray == true %}
{%- if field.type != 'select' %}
      var {{ fieldName }}Ids = new Array();
      angular.forEach({{ schema | lower }}Json.{{ fieldName }}, function({{ field.ref | lower }}){
        {{ fieldName }}Ids.push({{ field.ref | lower }}._id);
      });
      {{ schema | lower }}Json.{{ fieldName }} = {{ fieldName }}Ids;
{%- endif %}
{%- else %}
      {{ schema | lower }}Json.{{ fieldName }} = ({{ schema | lower }}Json.{{ fieldName }} && {{ schema | lower }}Json.{{ fieldName }}._id) ? {{ schema | lower }}Json.{{ fieldName }}._id : null;
{%- endif %}
{%- endif %}{%- endfor %}
      if($scope.{{ schema | lower }}._id != null)
        {{ schema | lower }}.update({{ schema | lower }}Json, function(data){ if(validate($scope.errors.{{ schema | lower }}, data)){ $scope.query{{ schema | capitalize }}(); $scope.count(); $scope.clear(); share.window(windowCallBack); }});
      else
        {{ schema | lower }}.save({{ schema | lower }}Json, function(data){ if(validate($scope.errors.{{ schema | lower }}, data)){ $scope.query{{ schema | capitalize }}(); $scope.count(); $scope.clear(); share.window(windowCallBack); }});
    }
{%- if hasUnion == true %}
    var {{ schema | lower }}ValidDef = $q.defer();
    var ignorePaths = [{%- for fieldName, field in fields %}{%- if field.ref && field.type == "union" %}"{{ fieldName | lower }}",{%- endif %}{%- endfor %}];
    {{ schema | lower }}.validate($scope.{{ schema | lower }}, function(data){ if(validate($scope.errors.{{ schema | lower }}, data, ignorePaths)) { {{ schema | lower }}ValidDef.resolve(data); }});
{%- for fieldName, field in fields %}{%- if field.ref && field.type == "union" %}
    var {{ fieldName | lower }}ValidDef = $q.defer();
    {{ field.ref | lower }}.validate($scope.{{ schema | lower }}.{{ fieldName | lower }}, function(data){ if(validate($scope.errors.{{ schema | lower }}.{{ fieldName | lower }}, data)) { {{ fieldName | lower }}ValidDef.resolve(data); }});
{%- endif %}{%- endfor %}
    $q.all([
{%- for fieldName, field in fields %}{%- if field.ref && field.type == "union" %}
      {{ fieldName | lower }}ValidDef.promise,{%- endif %}{%- endfor %}
      {{ schema | lower }}ValidDef.promise
    ]).then(function(validResponse){
  {%- for fieldName, field in fields %}{%- if field.ref && field.type == "union" %}
      var {{ fieldName | lower }}SaveDef = $q.defer();
      if($scope.{{ schema | lower }}.{{ fieldName | lower }}._id != null)
        {{ field.ref | lower }}.update($scope.{{ schema | lower }}.{{ fieldName | lower }}, function(data){ if(validate($scope.errors.{{ schema | lower }}.{{ fieldName | lower }}, data)) { {{ fieldName | lower }}SaveDef.resolve(data); }});
      else
        {{ field.ref | lower }}.save($scope.{{ schema | lower }}.{{ fieldName | lower }}, function(data){ if(validate($scope.errors.{{ schema | lower }}.{{ fieldName | lower }}, data)) { {{ fieldName | lower }}SaveDef.resolve(data); }});
  {%- endif %}{%- endfor %}
      $q.all([
  {%- for fieldName, field in fields %}{%- if field.ref && field.type == "union" %}
        {{ fieldName | lower }}SaveDef.promise,{%- endif %}{%- endfor %}
      ]).then(function(servicesResponse){
        try {
  {%- set indexService = 0 %}{%- for fieldName, field in fields %}{%- if field.ref && field.type == "union" %}
          if(servicesResponse[{{indexService}}] == null || servicesResponse[{{indexService}}]._id == null)
            throw "service {{ field.ref | lower }} error";
          else
            $scope.{{ schema | lower }}.{{ fieldName | lower }} = servicesResponse[{{indexService}}];
  {%- set indexService = indexService+1 %}{%- endif %}{%- endfor %}
          save();
        } catch(err) {
          throw err;
        }
      });
    });
{%- else %} 
    save();
{%- endif %}
  }

  $scope.destroyByIndex = function(index) {
    $scope.{{ schema | lower }}s[index].$delete(function(responseData){
      share.alert.show = true;
      share.alert.style = responseData.event.style;
      share.alert.message = responseData.event.message;
    });
    $scope.{{ schema | lower }}s.splice(index, 1);
  }
  
  $scope.filterNormalize = function() {
    for(var k in $scope.filter{{ schema | capitalize }}) {
      if($scope.filter{{ schema | capitalize }}[k] == null || $scope.filter{{ schema | capitalize }}[k] == "")
        delete $scope.filter{{ schema | capitalize }}[k];
    }
  }

  $scope.filter = function() {
    $scope.filterNormalize();
    $scope.{{ schema | lower }}s = {{ schema | lower }}.query({filter: JSON.stringify($scope.filter{{ schema | capitalize }})});
  }

  $scope.query{{ schema | capitalize }} = function() {
      $scope.{{ schema | lower }}s = {{ schema | lower }}.query(function () { 
        $scope.statusData.listing = $scope.{{ schema | lower }}s.length;
      });
  }

  $scope.count = function() {
    $scope.filterNormalize();
    // {{ schema | lower }}.count() ...  
    $http.get("/{{ schema | lower }}/count", {params: {filter: JSON.stringify($scope.filter{{ schema | capitalize }})}})
      .success(function (data, status, headers, config){
        $scope.statusData.totality = data.totality;
        $scope.statusData.filtered = data.filtered;
        $scope.statusData.listing = $scope.{{ schema | lower }}s.length;
      })
      .error(function (data, status, headers, config){});
  }

  $scope.queryMore = function() {
    $scope.filterNormalize();
    var more{{ schema | capitalize }}s = {{ schema | lower }}.query({skip: $scope.{{ schema | lower }}s.length, filter: JSON.stringify($scope.filter{{ schema | capitalize }})}, function(){
      angular.forEach(more{{ schema | capitalize }}s, function({{ schema | lower }}){
        $scope.{{ schema | lower }}s.push({{ schema | lower }});  
      });
    });
  }
  
  $scope.select = function(index) {
    $scope.{{ schema | lower }} = $scope.{{ schema | lower }}s[index];
{%- for fieldName, field in fields %}{%- if field.ref && field.type == 'select' %}
{%- if field.isArray == true %}
      var {{ fieldName }}Ids = new Array();
      angular.forEach($scope.{{ schema | lower }}.{{ fieldName }}, function({{ field.ref | lower }}){
        {{ fieldName }}Ids.push({{ field.ref | lower }}._id);
      });
      $scope.{{ schema | lower }}.{{ fieldName }} = {{ fieldName }}Ids;
{%- else %}
      $scope.{{ schema | lower }}.{{ fieldName }} = $scope.{{ schema | lower }}.{{ fieldName }}._id;
{%- endif %}{%- endif %}{%- endfor %}
  }
  
  $scope.clear = function() {
    delete $scope.{{ schema | lower }};
    $scope.{{ schema | lower }} = {};
{%- for fieldName, field in fields %}{%- if field.ref && field.type == "select" %}
    $scope.clear{{ schema | capitalize }}{{ fieldName | capitalize }}();{%- elseif field.isSubDoc == true && field.isArray == true %}
    $scope.clear{{ fieldName | capitalize }}();{%- endif %}{%- endfor %}
  }

{%- for key, ref in allRefs|uniq %}{%- if ref|lower != schema|lower %}
  $scope.query{{ ref | capitalize }} = function(){
    $scope.{{ ref | lower }}s = {{ ref | lower }}.query();
  };
  $scope.query{{ ref | capitalize }}();
{%- endif %}{%- endfor %}

{{ render_refSelect(schema, fields) }}

{%- for fieldName, field in fields %}{%- if field.ref && field.type != "select" %}
  $scope.{{ schema | lower }}.{{ fieldName | lower }} = {};
  $scope.errors.{{ schema | lower }}.{{ fieldName | lower }} = {};
  $scope.clear{{ fieldName | capitalize }} = function() {
    delete $scope.{{ schema | lower }}.{{ fieldName | lower }};
    $scope.{{ schema | lower }}.{{ fieldName | lower }} = {};
  }
{%- endif %}
{{ render_subDoc(schema, fieldName, field) }}
{%- endfor %}

}

{%- macro render_refSelect(schema, fields) %}
{%- for fieldName, field in fields %}{%- if field.ref && field.type == 'select' %}
  $scope.{{ schema | lower }}.{{ fieldName | lower }} = new Array();
  $scope.new{{ schema | capitalize }}{{ fieldName | capitalize }} = {};
  $scope.errors.new{{ schema | capitalize }}{{ fieldName | capitalize }} = {};

  $scope.createOrUpdate{{ schema | capitalize }}{{ fieldName | capitalize }} = function() {
    function save(dataResponse) {
      if(validate($scope.errors.new{{ schema | capitalize }}{{ fieldName | capitalize }}, dataResponse)) {
        $scope.{{ field.ref | lower }}s.push(dataResponse);
        {%- if field.isArray == true %}
        if(!($scope.{{ schema | lower }}.{{ fieldName | lower }} instanceof Array))
          $scope.{{ schema | lower }}.{{ fieldName | lower }} = new Array();
        $scope.{{ schema | lower }}.{{ fieldName | lower }}.push(dataResponse._id);
        {%- else %}
        $scope.{{ schema | lower }}.{{ fieldName | lower }} = dataResponse._id;
        {%- endif %}
        $scope.clear{{ schema | capitalize }}{{ fieldName | capitalize }}();
        share.windowBack();
      }
    }
    if($scope.new{{ schema | capitalize }}{{ fieldName | capitalize }}._id != null)
      {{ field.ref | lower }}.update($scope.new{{ schema | capitalize }}{{ fieldName | capitalize }}, save);
    else
      {{ field.ref | lower }}.save($scope.new{{ schema | capitalize }}{{ fieldName | capitalize }}, save);
  }

  $scope.clear{{ schema | capitalize }}{{ fieldName | capitalize }} = function() {
    delete $scope.new{{ schema | capitalize }}{{ fieldName | capitalize }};
    $scope.new{{ schema | capitalize }}{{ fieldName | capitalize }} = {};
  }
{%- endif %}
{%- if field.hasRef && field.fields %}
$scope.{{ field.ref | lower }} = {};
{{ render_refSelect(field.ref, field.fields) }}
{%- endif %}{%- endfor %}{%- endmacro %}

{%- macro render_subDoc(schema, fieldName, field) %}
{%- if field.isSubDoc == true %}
  {%- if field.isArray == true %}

  $scope.{{ schema | lower }}.{{ fieldName | lower }} = new Array();
  $scope.{{ schema | lower }}.new{{ fieldName | capitalize }} = {};
  //$scope.errors.{{ schema | lower }}.new{{ fieldName | capitalize }} = false;

  $scope.createOrUpdate{{ fieldName | capitalize }} = function(){
    if($scope.{{ schema | lower }}.{{ fieldName | lower }} == null)
      $scope.{{ schema | lower }}.{{ fieldName | lower }} = new Array();
    $scope.{{ schema | lower }}.{{ fieldName | lower }}.push($scope.{{ schema | lower }}.new{{ fieldName|capitalize }});
  }

  $scope.clear{{ fieldName | capitalize }} = function() {
    delete $scope.{{ schema | lower }}.new{{ fieldName | capitalize }};
    $scope.{{ schema | lower }}.new{{ fieldName | capitalize }} = {};
  }

  $scope.select{{ fieldName | capitalize }} = function(index) {
    $scope.{{ schema | lower }}.new{{ fieldName | capitalize }} = $scope.{{ schema | lower }}.{{ fieldName | lower }}[index];
  }

  $scope.destroy{{ fieldName | capitalize }}ByIndex = function (index) {
    $scope.{{ schema | lower }}.{{ fieldName | lower }}.splice(index, 1);
  }
  {%- else %}
  $scope.{{ schema | lower }}.{{ fieldName | lower }} = {};
  //$scope.errors.{{ schema | lower }}.{{ fieldName | lower }} = false;
  {%- endif %}
{%- elseif field.hasSubDoc == true %}
{%- for subFieldName, subField in field.fields %}
{{ render_subDoc(schema+'.'+fieldName, subFieldName, subField) }}
{%- endfor %}
{%- endif %}
{%- endmacro %}