function {{ schema | capitalize }}PublicController($scope, $http, $q, share, {{ schema | lower }}{%- for fieldName, field in fields %}{%- if field.ref %}, {{ field.ref | lower }}{%- endif %}{%- endfor %}) {
  $scope.share = share;
  $scope.{{ schema | lower }} = {};
  $scope.notFilter = true;
  $scope.filter{{ schema | capitalize }} = {};
  $scope.statusData = { totality: 0, filtered: 0, listing: 0 };

{%- for fieldName, field in fields %}
{%- if field.ref %}
  $scope.{{ schema | lower }}.{{ fieldName | lower }} = {};
{%- if field.type == "select" %}
  $scope.new{{ fieldName | capitalize }} = {};
  $scope.query{{ fieldName | capitalize }} = function(){
    $scope.{{ fieldName | lower }} = {{ field.ref | lower }}.query();
  };
  $scope.query{{ fieldName | capitalize }}();

  $scope.createOrUpdate{{ fieldName | capitalize }} = function() {
    function save({{ fieldName | lower }}Response) {
      $scope.{{ fieldName | lower }}.push({{ fieldName | lower }}Response);
      {%- if field.isArray == true %}
      $scope.{{ schema | lower }}.{{ fieldName | lower }}.push({{ fieldName | lower }}Response._id);
      {%- else %}
      $scope.{{ schema | lower }}.{{ fieldName | lower }} = {{ fieldName | lower }}Response._id;
      {%- endif %}
    }
    if($scope.new{{ fieldName | capitalize }}._id != null)
      {{ field.ref | lower }}.update($scope.new{{ fieldName | capitalize }}, save);
    else
      {{ field.ref | lower }}.save($scope.new{{ fieldName | capitalize }}, save);
  };

  $scope.clear{{ fieldName | capitalize }} = function() {
    delete $scope.new{{ fieldName | capitalize }};
    $scope.new{{ fieldName | capitalize }} = {};
  };
{%- else %}
  $scope.clear{{ fieldName | capitalize }} = function() {
    delete $scope.{{ schema | lower }}.{{ fieldName | lower }};
    $scope.{{ schema | lower }}.{{ fieldName | lower }} = {};
  };
{%- endif %}{%- endif %}
{{ render_subDoc(schema, fieldName, field) }}
{%- endfor %}

  $scope.createOrUpdate = function() {
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
      {{ schema | lower }}Json.{{ fieldName }} = {{ schema | lower }}Json.{{ fieldName }}._id;
{%- endif %}
{%- endif %}{%- endfor %}
      if($scope.{{ schema | lower }}._id != null)
        {{ schema | lower }}.update({{ schema | lower }}Json, function(){ $scope.query(); $scope.count(); $scope.clear(); });
      else
        {{ schema | lower }}.save({{ schema | lower }}Json, function(){ $scope.query(); $scope.count(); $scope.clear(); });
    }
{%- if hasUnion == true %}{%- for fieldName, field in fields %}{%- if field.ref && field.type == "union" %}
      var {{ fieldName | lower }}Def = $q.defer();
      ($scope.{{ schema | lower }}.{{ fieldName | lower }}._id != null) ? 
        {{ field.ref | lower }}.update($scope.{{ schema | lower }}.{{ fieldName | lower }}, function({{ fieldName | lower }}Response){ {{ fieldName | lower }}Def.resolve({{ fieldName | lower }}Response); }) : 
        {{ field.ref | lower }}.save($scope.{{ schema | lower }}.{{ fieldName | lower }}, function({{ fieldName | lower }}Response){ {{ fieldName | lower }}Def.resolve({{ fieldName | lower }}Response); });
{%- endif %}{%- endfor %}
    $q.all([
{%- for fieldName, field in fields %}{%- if field.ref && field.type == "union" %}
      {{ fieldName | lower }}Def.promise,
{%- endif %}{%- endfor %}
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
{%- else %} 
    save();
{%- endif %}
  };

  $scope.destroyByIndex = function(index) {
    $scope.{{ schema | lower }}s[index].$delete();
    $scope.{{ schema | lower }}s.splice(index, 1);
  };
  
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

  $scope.query = function(cb) {
      $scope.{{ schema | lower }}s = {{ schema | lower }}.query(function () { 
        $scope.statusData.listing = $scope.{{ schema | lower }}s.length;
      });
  };

  $scope.count = function() {
    $scope.filterNormalize();
    $http.get("/{{ schema | lower }}/count", {params: {filter: JSON.stringify($scope.filter{{ schema | capitalize }})}})
      .success(function (data, status, headers, config){
        $scope.statusData.totality = data.totality;
        $scope.statusData.filtered = data.filtered;
        $scope.statusData.listing = $scope.{{ schema | lower }}s.length;
      })
      .error(function (data, status, headers, config){});
  };

  $scope.queryMore = function() {
    $scope.filterNormalize();
    var more{{ schema | capitalize }}s = {{ schema | lower }}.query({skip: $scope.{{ schema | lower }}s.length, filter: JSON.stringify($scope.filter{{ schema | capitalize }})}, function(){
      angular.forEach(more{{ schema | capitalize }}s, function({{ schema | lower }}){
        $scope.{{ schema | lower }}s.push({{ schema | lower }});  
      });
    });
  };
  
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
  };
  
  $scope.clear = function() {
    delete $scope.{{ schema | lower }};
    $scope.{{ schema | lower }} = {};
{%- for fieldName, field in fields %} 
  {%- if field.ref || (field.isSubDoc == true && field.isArray == true) %}
    $scope.clear{{ fieldName | capitalize }}();
{%- endif %}{%- endfor %}
  };
}

{{ schema | capitalize }}PublicController.$inject = ['$scope', '$http', '$q', 'share', '{{ schema | lower }}'{%- for fieldName, field in fields %}{%- if field.ref %}, '{{ field.ref | lower }}'{%- endif %}{%- endfor %}];

{%- macro render_subDoc(schema, fieldName, field) %}{%- if field.isSubDoc == true %}{%- if field.isArray == true %}

  $scope.{{ schema | lower }}.{{ fieldName | lower }} = new Array();
  $scope.{{ schema | lower }}.new{{ fieldName | capitalize }} = {};

  $scope.createOrUpdate{{ fieldName | capitalize }} = function(){
    if($scope.{{ schema | lower }}.{{ fieldName | lower }} == null)
      $scope.{{ schema | lower }}.{{ fieldName | lower }} = new Array();
    $scope.{{ schema | lower }}.{{ fieldName | lower }}.push($scope.{{ schema | lower }}.new{{ fieldName|capitalize }});
  };

  $scope.clear{{ fieldName | capitalize }} = function() {
    delete $scope.{{ schema | lower }}.new{{ fieldName | capitalize }};
    $scope.{{ schema | lower }}.new{{ fieldName | capitalize }} = {};
  };

  $scope.select{{ fieldName | capitalize }} = function(index) {
    $scope.{{ schema | lower }}.new{{ fieldName | capitalize }} = $scope.{{ schema | lower }}.{{ fieldName | lower }}[index];
  };

  $scope.destroy{{ fieldName | capitalize }}ByIndex = function (index) {
    $scope.{{ schema | lower }}.{{ fieldName | lower }}.splice(index, 1);
  }
{%- else %}
  $scope.{{ schema | lower }}.{{ fieldName | lower }} = {};
{%- endif %}
{%- elseif field.hasSubDoc == true %}
{%- for subFieldName, subField in field.fields %}
{{ render_subDoc(schema+'.'+fieldName, subFieldName, subField) }}
{%- endfor %}
{%- endif %}
{%- endmacro %}