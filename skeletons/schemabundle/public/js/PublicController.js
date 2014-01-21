function {{ schema | capitalize }}PublicController($scope, $http, share, {{ schema | lower }}{%- for fieldName, field in fields %}{%- if field.ref %}, {{ field.ref | lower }}{%- endif %}{%- endfor %}) {
  $scope.share = share;
  $scope.{{ schema | lower }} = {};
  $scope.filterData = {};
  $scope.ref = {};
  $scope.statusData = { totality: 0, filtered: 0, listing: 0 };

{%- for fieldName, field in fields %} 
  {%- if field.ref %}
  $scope.ref.{{ fieldName | lower }} = {};

  {%- if field.type == "select" %}
    $scope.query{{ fieldName | capitalize }} = function(){
      $scope.{{ fieldName | lower }} = {{ field.ref | lower }}.query();
    };

    $scope.query{{ fieldName | capitalize }}();
  {%- endif %}

  $scope.createOrUpdate{{ fieldName | capitalize }} = function() {
    if($scope.ref.{{ fieldName | lower }}._id != null)
      {{ field.ref | lower }}.update($scope.ref.{{ fieldName | lower }});
    else
      {{ field.ref | lower }}.save($scope.ref.{{ fieldName | lower }});
  };

  $scope.clear{{ fieldName | capitalize }} = function() {
    delete $scope.ref.{{ fieldName | lower }};
    $scope.ref.{{ fieldName | lower }} = {};
  };

{%- endif %}{%- endfor %}

  $scope.createOrUpdate = function() {
{%- for fieldName, field in fields %} 
  {%- if field.ref %}
    $scope.createOrUpdate{{ fieldName | capitalize }}();
{%- endif %}{%- endfor %}
    if($scope.{{ schema | lower }}._id != null)
      {{ schema | lower }}.update($scope.{{ schema | lower }});
    else
      {{ schema | lower }}.save($scope.{{ schema | lower }});
  };

  $scope.destroyByIndex = function(index) {
    $scope.{{ schema | lower }}s[index].$delete();
    $scope.{{ schema | lower }}s.splice(index, 1);
  };
  
  $scope.filterNormalize = function() {
    for(var k in $scope.filterData) {
      if($scope.filterData[k] == null || $scope.filterData[k] == "")
        delete $scope.filterData[k];
    }
  }

  $scope.filter = function() {
    $scope.filterNormalize();
    $scope.{{ schema | lower }}s = {{ schema | lower }}.query({filter: JSON.stringify($scope.filterData)});
  }

  $scope.query = function(cb) {
      $scope.{{ schema | lower }}s = {{ schema | lower }}.query(function () { 
        $scope.statusData.listing = $scope.{{ schema | lower }}s.length;
      });
  };

  $scope.count = function() {
    $scope.filterNormalize();
    $http.get("/{{ schema | lower }}/count", {params: {filter: JSON.stringify($scope.filterData)}})
      .success(function (data, status, headers, config){
        $scope.statusData.totality = data.totality;
        $scope.statusData.filtered = data.filtered;
        $scope.statusData.listing = $scope.{{ schema | lower }}s.length;
      })
      .error(function (data, status, headers, config){});
  };

  $scope.queryMore = function() {
    $scope.filterNormalize();
    var more{{ schema | capitalize }}s = {{ schema | lower }}.query({skip: $scope.{{ schema | lower }}s.length, filter: JSON.stringify($scope.filterData)}, function(){
      angular.forEach(more{{ schema | capitalize }}s, function({{ schema | lower }}){
        $scope.{{ schema | lower }}s.push({{ schema | lower }});  
      });
    });
  };
  
  $scope.select = function(index) {
    $scope.{{ schema | lower }} = $scope.{{ schema | lower }}s[index];
  };
  
  $scope.clear = function() {
{%- for fieldName, field in fields %} 
  {%- if field.ref %}
    $scope.clear{{ fieldName | capitalize }}();
{%- endif %}{%- endfor %}
    delete $scope.{{ schema | lower }};
    $scope.{{ schema | lower }} = {};
  };
}

{{ schema | capitalize }}PublicController.$inject = ['$scope','$http', 'share', '{{ schema | lower }}'{%- for fieldName, field in fields %}{%- if field.ref %}, '{{ field.ref | lower }}'{%- endif %}{%- endfor %}];