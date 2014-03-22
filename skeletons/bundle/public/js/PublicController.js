{%- macro subDocArray(schema, fields) %}{%- for fieldName, field in fields %}{%- if field.isSubDoc && field.isArray %}
  $scope.new{{ field.fullPathCc | replace("^"+schema, "", "g") }} = $scope.new{{ field.fullPathCc | replace("^"+schema, "", "g") }} || (share.getRefObject('new{{ field.fullPathCc | replace("^"+schema, "", "g") }}') != null) ? share.getRefObject('new{{ field.fullPathCc | replace("^"+schema, "", "g") }}') : {};
  $scope.new{{ field.fullPathCc | replace("^"+schema, "", "g") }}Mode = 'create';
  $scope.createOrUpdate{{ field.fullPathCc | replace("^"+schema, "", "g") }} = function(){
    if(!($scope.{{ field.fullPath }} instanceof Array))
      $scope.{{ field.fullPath }} = new Array();
    if($scope.new{{ field.fullPathCc | replace("^"+schema, "", "g") }}Mode == 'create')
      $scope.{{ field.fullPath }}.push($scope.new{{ field.fullPathCc | replace("^"+schema, "", "g") }});
    $scope.clear{{ field.fullPathCc | replace("^"+schema, "", "g") }}();
  }

  $scope.clear{{ field.fullPathCc | replace("^"+schema, "", "g") }} = function() {
    delete $scope.new{{ field.fullPathCc | replace("^"+schema, "", "g") }};
    $scope.new{{ field.fullPathCc | replace("^"+schema, "", "g") }} = {};
    $scope.new{{ field.fullPathCc | replace("^"+schema, "", "g") }}Mode = 'create';
  }

  $scope.select{{ field.fullPathCc | replace("^"+schema, "", "g")}} = function(index) {
    if($scope.{{ field.fullPath }} == null || !$scope.{{ field.fullPath }}[index])
      return share.alertDanger('{{ field.fullPathCc | replace("^"+schema, "", "g") }} not found!');
    $scope.new{{ field.fullPathCc | replace("^"+schema, "", "g") }} = $scope.{{ field.fullPath }}[index];
    $scope.new{{ field.fullPathCc | replace("^"+schema, "", "g") }}Mode = 'update';
  }

  $scope.destroy{{ field.fullPathCc | replace("^"+schema, "", "g") }}ByIndex = function(index) {
    if($scope.{{ field.fullPath }} == null || !$scope.{{ field.fullPath }}[index])
      return share.alertDanger('{{ field.fullPathCc | replace("^"+schema, "", "g") }} not found!');
    $scope.{{ field.fullPath }}.splice(index, 1);
  }
{% elseif field.isSubDoc && field.fields %}
{{ subDocArray(schema, field.fields) }}
{% endif %}{%- endfor %}{%- endmacro %}

{%- macro subDocArrayClear(schema, fields) %}{%- for fieldName, field in fields %}{%- if field.isSubDoc && field.isArray %}
    $scope.clear{{ field.fullPathCc | replace("^"+schema, "", "g") }}();{% elseif field.isSubDoc && field.fields %}{{ subDocArrayClear(schema, field.fields) }}{% endif %}{%- endfor %}{%- endmacro %}


{%- macro initSubDocs(schema, fields) %}{%- for fieldName, field in fields %}{%- if field.isSubDoc %}{%- if field.isArray %}
  $scope.{{ field.fullPath }} = $scope.{{ field.fullPath }} || new Array();{%- else %}
  $scope.{{ field.fullPath }} = $scope.{{ field.fullPath }} || {};{%- endif %}
  $scope.errors.{{ field.fullPath }} = {};{%- if field.fields %}{{ initSubDocs(schema, field.fields) }}{% endif %}{% endif %}{%- endfor %}{%- endmacro %}

function {{ schema | capitalize }}PublicController($scope, $http, $q, share, {{ schema | capitalize }}{%- for key, ref in allRefs|uniq %}{%- if ref|lower != schema|lower %}, {{ ref | capitalize }}{%- endif %}{%- endfor %}) {
  $scope.share = share;
  $scope.notFilter = true;
  $scope.dataList = new DataList();
  $scope.{{ schema | lower }} = $scope.{{ schema | lower }} || (share.getRefObject("{{schema|lower}}") != null) ? share.getRefObject("{{schema|lower}}") : {};
  $scope.errors = {};
  $scope.errors.{{ schema | lower }} = {};
  {{ initSubDocs(schema, fields) }}

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
        if(dataResponse.data && dataResponse.data._id)
          share.refAddObject("{{schema | lower}}", dataResponse.data);
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
      if(dataResponse.event.status == true) {
        $scope.dataList.status.totality = $scope.dataList.status.totality-1;
        $scope.dataList.status.listing = $scope.dataList.data.length;
      }
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
    $scope.errors = {};
    $scope.errors.{{ schema | lower }} = {};
    {{ initSubDocs(schema, fields) }}
    {{ subDocArrayClear(schema, fields) }}
  }

{%- for key, ref in allRefs|uniq %}{% if ref|lower != schema|lower %}
  $scope.query{{ ref | capitalize }} = function(){
    $scope.{{ ref | lower }}s = {{ ref | capitalize }}.query();
  };
  $scope.query{{ ref | capitalize }}();{% endif %}{%- endfor %}

{%- for fieldName, field in fields %}{%- if field.ref && field.type == "union" %}
  $scope.{{ schema | lower }}.{{ fieldName | lower }} = {};
  $scope.errors.{{ schema | lower }}.{{ fieldName | lower }} = {};
  $scope.clear{{ fieldName | capitalize }} = function() {
    delete $scope.{{ schema | lower }}.{{ fieldName | lower }};
    $scope.{{ schema | lower }}.{{ fieldName | lower }} = {};
  }{%- endif %}{%- endfor %}

  {{ subDocArray(schema, fields) }}

}

