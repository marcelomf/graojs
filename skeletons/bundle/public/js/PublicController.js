{%- macro render_subDocArray() %}
{%- for fieldName, field in fields %}{%- if field.isSubDoc == true && field.isArray == true%}
  $scope.new{{ fieldName | capitalize }} = {};
  $scope.new{{ fieldName | capitalize }}Mode = 'create';
  $scope.{{ field.fullPath }} = $scope.{{ field.fullPath }} || new Array();

  $scope.createOrUpdate{{ fieldName | capitalize }} = function(){
    if($scope.{{ field.fullPath }} == null)
      return share.alertDanger("{{ fieldName | capitalize }} not to be null.");
    if($scope.new{{ fieldName | capitalize }}Mode == 'create')
      $scope.{{ field.fullPath }}.push($scope.new{{ fieldName | capitalize }});
    $scope.clear{{ fieldName | capitalize }}();
  }

  $scope.clear{{ fieldName | capitalize }} = function() {
    delete $scope.new{{ fieldName | capitalize }};
    $scope.new{{ fieldName | capitalize }} = {};
    $scope.new{{ fieldName | capitalize }}Mode = 'create';
  }

  $scope.select{{ fieldName | capitalize}} = function(index) {
    if($scope.{{ field.fullPath }} == null || !$scope.{{ field.fullPath }}[index])
      return share.alertDanger("{{ fieldName | capitalize }} not found!");
    $scope.new{{ fieldName | capitalize }} = $scope.{{ field.fullPath }}[index];
    $scope.new{{ fieldName | capitalize }}Mode = 'update';
  }

  $scope.destroy{{ fieldName | capitalize }}ByIndex = function(index) {
    if($scope.{{ field.fullPath }} == null || !$scope.{{ field.fullPath }}[index])
      return share.alertDanger("{{ fieldName | capitalize }} not found!");
    $scope.{{ field.fullPath }}.splice(index, 1);
  }
{%- endif %}{%- endfor %}{%- endmacro %}

{%- macro render_subDoc(schema, fieldName, field) %}
{%- if field.isSubDoc == true && !field.isArray %}
  $scope.{{ field.fullPath }} = $scope.{{ field.fullPath }} || {};
  //$scope.errors.{{ field.fullPath }} = false;
{%- elseif field.hasSubDoc == true && !field.ref %}
{%- for subFieldName, subField in field.fields %}
{{ render_subDoc(schema, subFieldName, subField) }}
{%- endfor %}{%- endif %}{%- endmacro %}
function {{ schema | capitalize }}PublicController($scope, $http, $q, share, {{ schema | capitalize }}{%- for key, ref in allRefs|uniq %}{%- if ref|lower != schema|lower %}, {{ ref | capitalize }}{%- endif %}{%- endfor %}) {
  $scope.share = share;
  $scope.{{ schema | lower }} = $scope.{{ schema | lower }} || (share.refHistory.{{schema}} != null && share.refHistory.{{schema}}.object != null) ? share.refHistory.{{schema}}.object : {};
  $scope.errors = {};
  $scope.errors.{{ schema | lower }} = {};
  $scope.notFilter = true;
  $scope.dataList = new DataList();

  $scope.$watch("dataList", function(newDataList, oldDataList) {
    if(oldDataList.page.current != newDataList.page.current || 
      oldDataList.page.limit != newDataList.page.limit) {
      newDataList.page.skip = newDataList.page.current * newDataList.page.limit - newDataList.page.limit;
      $scope.query{{ schema | capitalize }}();
    }
  }, true);

  $scope.createOrUpdate{{ schema | capitalize }} = function(windowCallBack, isRefered) {
    share.alertLoad();
    function finallySaved(dataResponse, windowCallBack, isRefered) {
      if(!isRefered) {
        {%- if isAutoRefered === true %}
        $scope.query{{ schema | capitalize }}("all");{% else %}
        $scope.query{{ schema | capitalize }}();{% endif %}
        $scope.count{{ schema | capitalize }}(); 
        $scope.clear{{ schema | capitalize }}();
      } else {
        share.ref.list = (share.ref.list instanceof Array) ? share.ref.list : new Array();
        share.ref.list.push(dataResponse.data);
        if(dataResponse.data._id) {
          if(!share.ref.objectField[share.ref.field])
            share.ref.objectField[share.ref.field] = (share.ref.isArray == true) ? new Array() : "";
          if(share.ref.objectField[share.ref.field] instanceof Array)
            share.ref.objectField[share.ref.field].push(dataResponse.data._id);
          else
            share.ref.objectField[share.ref.field] = dataResponse.data._id;
        }
      }
      if(windowCallBack)
        share.window(windowCallBack); 
      else
        share.windowBack();
    }

    function save() {
      var {{ schema | lower }}Json = $scope.{{ schema | lower }};
      if($scope.{{ schema | lower }}._id != null)
        {{ schema | capitalize }}.update({{ schema | lower }}Json, function(dataResponse){ 
          if(validate(share.alert, $scope.errors.{{ schema | lower }}, dataResponse))
            finallySaved(dataResponse, windowCallBack, isRefered);
        });
      else
        {{ schema | capitalize }}.save({{ schema | lower }}Json, function(dataResponse){ 
          if(validate(share.alert, $scope.errors.{{ schema | lower }}, dataResponse))
            finallySaved(dataResponse, windowCallBack, isRefered);
        });
    }
{%- if hasUnion == true %}
    var {{ schema | lower }}ValidDef = $q.defer();
    var ignorePaths = [{%- for fieldName, field in fields %}{%- if field.ref && field.type == "union" %}"{{ fieldName | lower }}",{%- endif %}{%- endfor %}];
    {{ schema | capitalize }}.validate($scope.{{ schema | lower }}, function(dataResponse){ 
      if(validate(share.alert, $scope.errors.{{ schema | lower }}, dataResponse, ignorePaths)) { 
        {{ schema | lower }}ValidDef.resolve(dataResponse); 
      }
    });
{%- for fieldName, field in fields %}{%- if field.ref && field.type == "union" %}
    var {{ fieldName | lower }}ValidDef = $q.defer();
    {{ field.ref | capitalize }}.validate($scope.{{ schema | lower }}.{{ fieldName | lower }}, function(dataResponse){ 
      if(validate(share.alert, $scope.errors.{{ schema | lower }}.{{ fieldName | lower }}, dataResponse)){ 
        {{ fieldName | lower }}ValidDef.resolve(dataResponse); 
      }
    });
{%- endif %}{%- endfor %}
    $q.all([
{%- for fieldName, field in fields %}{%- if field.ref && field.type == "union" %}
      {{ fieldName | lower }}ValidDef.promise,{%- endif %}{%- endfor %}
      {{ schema | lower }}ValidDef.promise
    ]).then(function(validResponse){
  {%- for fieldName, field in fields %}{%- if field.ref && field.type == "union" %}
      var {{ fieldName | lower }}SaveDef = $q.defer();
      if($scope.{{ schema | lower }}.{{ fieldName | lower }}._id != null)
        {{ field.ref | capitalize }}.update($scope.{{ schema | lower }}.{{ fieldName | lower }}, function(dataResponse){ 
          if(validate(share.alert, $scope.errors.{{ schema | lower }}.{{ fieldName | lower }}, dataResponse)){ 
            {{ fieldName | lower }}SaveDef.resolve(dataResponse); 
          }
        });
      else
        {{ field.ref | capitalize }}.save($scope.{{ schema | lower }}.{{ fieldName | lower }}, function(dataResponse){ 
          if(validate(share.alert, $scope.errors.{{ schema | lower }}.{{ fieldName | lower }}, dataResponse)){ 
            {{ fieldName | lower }}SaveDef.resolve(dataResponse); 
          }
        });
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
          share.alertDanger(err);
        }
      });
    });
{%- else %} 
    save();
{%- endif %}
  }

  $scope.destroy{{ schema | capitalize }}ByIndex = function(index) {
    share.alertLoad();
    $scope.dataList.data[index].$delete(function(dataResponse){
      share.alert.show = true;
      share.alert.style = dataResponse.event.style;
      share.alert.message = dataResponse.event.message;
    });
    $scope.dataList.data.splice(index, 1);{%- if isAutoRefered === true %}
    $scope.query{{ schema | capitalize }}("all");{% endif %}
  }

  $scope.query{{ schema | capitalize }} = function(queryMode) {
    share.alertLoad();
    if(queryMode === "reset")
      $scope.dataList.reset();
    
    if(queryMode === "all") {
      {{ schema | capitalize }}.query(null, function(dataResponse){ 
        $scope.{{ schema | lower }}s = dataResponse;
        $scope.dataList.data = dataResponse.slice(0, 10);
        $scope.dataList.status.listing = $scope.dataList.data.length;
        share.alertClean();
      });
    } else {
      {{ schema | capitalize }}.query($scope.dataList.toParams(), function(dataResponse){ 
        $scope.dataList.data = dataResponse;
        $scope.dataList.status.listing = $scope.dataList.data.length;
        share.alertClean();
      });
    }
    
  }{%- if isAutoRefered === true %}
  $scope.query{{ schema | capitalize }}("all");{% else %}
  $scope.query{{ schema | capitalize }}();{% endif %}

  $scope.count{{ schema | capitalize }} = function() {
    {{ schema | capitalize }}.count($scope.dataList.toParams(), function(dataResponse){
      $scope.dataList.status = dataResponse;
      $scope.dataList.status.listing = $scope.dataList.data.length;
    });
  }
  $scope.count{{ schema | capitalize }}();

  $scope.queryMore{{ schema | capitalize }} = function() {
    share.alertLoad();
    $scope.dataList.page.skip = $scope.dataList.data.length;
    {{ schema | capitalize }}.query($scope.dataList.toParams(), function(dataResponse){
      angular.forEach(dataResponse, function(data){
        $scope.dataList.data.push(data);
        $scope.dataList.status.listing++;
      });
      share.alertClean();
    });
  }
  
  $scope.select{{ schema | capitalize }} = function(index) {
    $scope.{{ schema | lower }} = $scope.dataList.data[index];
{%- for fieldName, field in fields %}{%- if field.ref && field.type == 'select' %}
{%- if field.isArray == true %}
      var {{ fieldName }}Ids = new Array();
      angular.forEach($scope.{{ schema | lower }}.{{ fieldName }}, function({{ field.ref | lower }}){
        {{ fieldName }}Ids.push({{ field.ref | lower }}._id);
      });
      $scope.{{ schema | lower }}._{{ fieldName }} = angular.copy($scope.{{ schema | lower }}.{{ fieldName }});
      $scope.{{ schema | lower }}.{{ fieldName }} = {{ fieldName }}Ids;
{%- else %}
      if($scope.{{ schema | lower }}.{{ fieldName }} && $scope.{{ schema | lower }}.{{ fieldName }}._id)
        $scope.{{ schema | lower }}.{{ fieldName }} = $scope.{{ schema | lower }}.{{ fieldName }}._id;
{%- endif %}{%- endif %}{%- endfor %}
  }
  
  $scope.clear{{ schema | capitalize }} = function() {
    delete $scope.{{ schema | lower }};
    $scope.{{ schema | lower }} = {};
{%- for fieldName, field in fields %}{%- if field.isSubDoc == true && field.isArray != true %}
    $scope.{{ field.fullPath }} = {};{%- elseif field.ref && field.type == "select" %}
    //$scope.clear{{ field.ref | capitalize }}();{%- elseif field.isSubDoc == true && field.isArray == true %}
    $scope.{{ field.fullPath }} = new Array();{%- endif %}{%- endfor %}
  }

{%- for key, ref in allRefs|uniq %}{% if ref|lower != schema|lower %}
  $scope.query{{ ref | capitalize }} = function(){
    $scope.{{ ref | lower }}s = {{ ref | capitalize }}.query();
  };
  $scope.query{{ ref | capitalize }}();
{% endif %}{%- endfor %}

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

{{ render_subDocArray() }}

}

