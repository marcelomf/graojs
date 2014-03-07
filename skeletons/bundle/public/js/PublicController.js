{%- macro render_refSelect(schema, fields) %}
{%- for fieldName, field in fields %}{%- if field.ref && field.type == 'select' %}
  $scope.{{ schema | lower }}.{{ fieldName | lower }} = new Array();
  $scope.new{{ schema | capitalize }}{{ fieldName | capitalize }} = {};
  $scope.errors.new{{ schema | capitalize }}{{ fieldName | capitalize }} = {};

  $scope.createOrUpdate{{ schema | capitalize }}{{ fieldName | capitalize }} = function() {
    function save(dataResponse) {
      if(validate(share.alert, $scope.errors.new{{ schema | capitalize }}{{ fieldName | capitalize }}, dataResponse)) {
        $scope.{{ field.ref | lower }}s.push(dataResponse.data);
        {%- if field.isArray == true %}
        if(!($scope.{{ schema | lower }}.{{ fieldName | lower }} instanceof Array))
          $scope.{{ schema | lower }}.{{ fieldName | lower }} = new Array();
        $scope.{{ schema | lower }}.{{ fieldName | lower }}.push(dataResponse.data._id);
        {%- else %}
        $scope.{{ schema | lower }}.{{ fieldName | lower }} = dataResponse.data._id;
        {%- endif %}
        $scope.clear{{ schema | capitalize }}{{ fieldName | capitalize }}();
        share.windowBack();
      }
    }
    if($scope.new{{ schema | capitalize }}{{ fieldName | capitalize }}._id != null)
      {{ field.ref | capitalize }}.update($scope.new{{ schema | capitalize }}{{ fieldName | capitalize }}, save);
    else
      {{ field.ref | capitalize }}.save($scope.new{{ schema | capitalize }}{{ fieldName | capitalize }}, save);
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
function {{ schema | capitalize }}PublicController($scope, $http, $q, share, {{ schema | capitalize }}{%- for key, ref in allRefs|uniq %}{%- if ref|lower != schema|lower %}, {{ ref | capitalize }}{%- endif %}{%- endfor %}) {
  $scope.share = share;
  $scope.{{ schema | lower }} = {};
  $scope.errors = {};
  $scope.errors.{{ schema | lower }} = {};
  $scope.notFilter = true;
  $scope.dataList = new DataList();

  $scope.$watch("dataList", function(newDataList, oldDataList) {
    if(oldDataList.page.current != newDataList.page.current || 
      oldDataList.page.limit != newDataList.page.limit) {
      newDataList.page.skip = newDataList.page.current * newDataList.page.limit - newDataList.page.limit;
      $scope.query();
    }
  }, true);

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
        {{ schema | capitalize }}.update({{ schema | lower }}Json, function(dataResponse){ if(validate(share.alert, $scope.errors.{{ schema | lower }}, dataResponse)){ $scope.query(); $scope.count(); $scope.clear(); share.window(windowCallBack); }});
      else
        {{ schema | capitalize }}.save({{ schema | lower }}Json, function(dataResponse){ if(validate(share.alert, $scope.errors.{{ schema | lower }}, dataResponse)){ $scope.query(); $scope.count(); $scope.clear(); share.window(windowCallBack); }});
    }
{%- if hasUnion == true %}
    var {{ schema | lower }}ValidDef = $q.defer();
    var ignorePaths = [{%- for fieldName, field in fields %}{%- if field.ref && field.type == "union" %}"{{ fieldName | lower }}",{%- endif %}{%- endfor %}];
    {{ schema | capitalize }}.validate($scope.{{ schema | lower }}, function(data){ if(validate(share.alert, $scope.errors.{{ schema | lower }}, data, ignorePaths)) { {{ schema | lower }}ValidDef.resolve(data); }});
{%- for fieldName, field in fields %}{%- if field.ref && field.type == "union" %}
    var {{ fieldName | lower }}ValidDef = $q.defer();
    {{ field.ref | capitalize }}.validate($scope.{{ schema | lower }}.{{ fieldName | lower }}, function(data){ if(validate(share.alert, $scope.errors.{{ schema | lower }}.{{ fieldName | lower }}, data)) { {{ fieldName | lower }}ValidDef.resolve(data); }});
{%- endif %}{%- endfor %}
    $q.all([
{%- for fieldName, field in fields %}{%- if field.ref && field.type == "union" %}
      {{ fieldName | lower }}ValidDef.promise,{%- endif %}{%- endfor %}
      {{ schema | lower }}ValidDef.promise
    ]).then(function(validResponse){
  {%- for fieldName, field in fields %}{%- if field.ref && field.type == "union" %}
      var {{ fieldName | lower }}SaveDef = $q.defer();
      if($scope.{{ schema | lower }}.{{ fieldName | lower }}._id != null)
        {{ field.ref | capitalize }}.update($scope.{{ schema | lower }}.{{ fieldName | lower }}, function(dataResponse){ if(validate(share.alert, $scope.errors.{{ schema | lower }}.{{ fieldName | lower }}, dataResponse)) { {{ fieldName | lower }}SaveDef.resolve(dataResponse); }});
      else
        {{ field.ref | capitalize }}.save($scope.{{ schema | lower }}.{{ fieldName | lower }}, function(dataResponse){ if(validate(share.alert, $scope.errors.{{ schema | lower }}.{{ fieldName | lower }}, dataResponse)) { {{ fieldName | lower }}SaveDef.resolve(dataResponse); }});
  {%- endif %}{%- endfor %}
      $q.all([
  {%- for fieldName, field in fields %}{%- if field.ref && field.type == "union" %}
        {{ fieldName | lower }}SaveDef.promise,{%- endif %}{%- endfor %}
      ]).then(function(servicesResponse){
        try {
  {%- set indexService = 0 %}{%- for fieldName, field in fields %}{%- if field.ref && field.type == "union" %}
          if(servicesResponse[{{indexService}}] == null || servicesResponse[{{indexService}}].data._id == null)
            throw "service {{ field.ref | lower }} error";
          else
            $scope.{{ schema | lower }}.{{ fieldName | lower }} = servicesResponse[{{indexService}}].data;
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
    $scope.dataList.data[index].$delete(function(dataResponse){
      share.alert.show = true;
      share.alert.style = dataResponse.event.style;
      share.alert.message = dataResponse.event.message;
    });
    $scope.dataList.data.splice(index, 1);
  }

  $scope.filter = function() {
    $scope.dataList.data = {{ schema | capitalize }}.query($scope.dataList.toParams());
  }

  $scope.query = function() {
      $scope.dataList.data = {{ schema | capitalize }}.query($scope.dataList.toParams(), function () { 
        $scope.dataList.status.listing = $scope.dataList.data.length;
      });
  }
  $scope.query();

  $scope.count = function() {
    $scope.dataList.status = {{ schema | capitalize }}.count($scope.dataList.toParams(), function(dataResponse){
      $scope.dataList.status.listing = $scope.dataList.data.length;
    });
  }
  $scope.count();

  $scope.queryMore = function() {
    $scope.dataList.page.skip = $scope.dataList.data.length;
    var more{{ schema | capitalize }}s = {{ schema | capitalize }}.query($scope.dataList.toParams(), function(){
      angular.forEach(more{{ schema | capitalize }}s, function({{ schema | lower }}){
        $scope.dataList.data.push({{ schema | lower }});
        $scope.dataList.status.listing++;
      });
    });
  }
  
  $scope.select = function(index) {
    $scope.{{ schema | lower }} = $scope.dataList.data[index];
{%- for fieldName, field in fields %}{%- if field.ref && field.type == 'select' %}
{%- if field.isArray == true %}
      var {{ fieldName }}Ids = new Array();
      angular.forEach($scope.{{ schema | lower }}.{{ fieldName }}, function({{ field.ref | lower }}){
        {{ fieldName }}Ids.push({{ field.ref | lower }}._id);
      });
      $scope.{{ schema | lower }}.{{ fieldName }} = {{ fieldName }}Ids;
{%- else %}
      if($scope.{{ schema | lower }}.{{ fieldName }} && $scope.{{ schema | lower }}.{{ fieldName }}._id)
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

{%- for key, ref in allRefs|uniq %}
  $scope.query{{ ref | capitalize }} = function(){
    $scope.{{ ref | lower }}s = {{ ref | capitalize }}.query();
  };
  $scope.query{{ ref | capitalize }}();
{%- endfor %}

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