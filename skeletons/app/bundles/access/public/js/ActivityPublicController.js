
function ActivityPublicController($scope, $http, $q, share, Activity) {
  $scope.share = share;
  $scope.notFilter = true;
  $scope.dataList = new DataList();
  $scope.activity = $scope.activity || (share.getRefObject("activity") != null) ? share.getRefObject("activity") : {};
  $scope.errors = {};
  $scope.errors.activity = {};

  $scope.$watch("dataList", function(newDataList, oldDataList) {
    if(oldDataList.page.current != newDataList.page.current || 
      oldDataList.page.limit != newDataList.page.limit) {
      newDataList.page.skip = newDataList.page.current * newDataList.page.limit - newDataList.page.limit;
      $scope.queryActivity();
    }
  }, true);

  $scope.createOrUpdateActivity = function(windowCallBack, isRefered) {
    share.alertLoad();
    function finallySaved(dataResponse, windowCallBack, isRefered) {
      if(!isRefered) {
        $scope.queryActivity("all");
        $scope.countActivity(); 
        $scope.clearActivity();
      } else {
        if(dataResponse.data && dataResponse.data._id)
          share.refAddObject("activity", dataResponse.data);
      }
      if(windowCallBack)
        share.window(windowCallBack); 
      else
        share.windowBack();
    }

    function save() {
      var activityJson = $scope.activity;
      if($scope.activity._id != null)
        Activity.update(activityJson, function(dataResponse){ 
          if(validate(share.alert, $scope.errors.activity, dataResponse))
            finallySaved(dataResponse, windowCallBack, isRefered);
        });
      else
        Activity.save(activityJson, function(dataResponse){ 
          if(validate(share.alert, $scope.errors.activity, dataResponse))
            finallySaved(dataResponse, windowCallBack, isRefered);
        });
    } 
    save();
  }

  $scope.destroyActivityByIndex = function(index) {
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
    $scope.dataList.data.splice(index, 1);
    $scope.queryActivity("all");
  }

  $scope.queryActivity = function(queryMode) {
    share.alertLoad();
    if(queryMode === "reset")
      $scope.dataList.reset();

    if(queryMode === "all") {
      Activity.query(null, function(dataResponse){ 
        $scope.activitys = dataResponse;
        $scope.dataList.data = dataResponse.slice(0, 10);
        $scope.dataList.status.listing = $scope.dataList.data.length;
        share.alertClean();
      });
    } else {
      Activity.query($scope.dataList.toParams(), function(dataResponse){ 
        $scope.dataList.data = dataResponse;
        $scope.dataList.status.listing = $scope.dataList.data.length;
        share.alertClean();
      });
    }

  }
  $scope.queryActivity("all");

  $scope.countActivity = function() {
    Activity.count($scope.dataList.toParams(), function(dataResponse){
      $scope.dataList.status = dataResponse;
      $scope.dataList.status.listing = $scope.dataList.data.length;
    });
  }
  $scope.countActivity();

  $scope.queryMoreActivity = function() {
    share.alertLoad();
    $scope.dataList.page.skip = $scope.dataList.data.length;
    Activity.query($scope.dataList.toParams(), function(dataResponse){
      angular.forEach(dataResponse, function(data){
        $scope.dataList.data.push(data);
        $scope.dataList.status.listing++;
      });
      share.alertClean();
    });
  }

  $scope.selectActivity = function(index) {
    $scope.activity = $scope.dataList.data[index];

      var activitysIds = new Array();
      angular.forEach($scope.activity.activitys, function(activity){
        activitysIds.push(activity._id);
      });
      $scope.activity._activitys = angular.copy($scope.activity.activitys);
      $scope.activity.activitys = activitysIds;

  }

  $scope.clearActivity = function() {
    delete $scope.activity;
    $scope.activity = {};
    $scope.errors = {};
    $scope.errors.activity = {};

  }

}

