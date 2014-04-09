
function UserPublicController($scope, $http, $q, share, User, Activity) {
  $scope.share = share;
  $scope.notFilter = true;
  $scope.dataList = new DataList();
  $scope.user = $scope.user || (share.getRefObject("user") != null) ? share.getRefObject("user") : {enabled: true};
  $scope.errors = {};
  $scope.errors.user = {};

  $scope.$watch("dataList", function(newDataList, oldDataList) {
    if(oldDataList.page.current != newDataList.page.current || 
      oldDataList.page.limit != newDataList.page.limit) {
      newDataList.page.skip = newDataList.page.current * newDataList.page.limit - newDataList.page.limit;
      $scope.queryUser();
    }
  }, true);

  $scope.updateProfile = function(windowCallBack) {
    share.alertLoad();
    var userJson = $scope.user;
    User.updateProfile(userJson, function(dataResponse){ 
      if(validate(share.alert, $scope.errors.user, dataResponse)){ 
        share.window(windowCallBack); 
      }
    });
  }

  $scope.createOrUpdateUser = function(windowCallBack, isRefered) {
    share.alertLoad();
    function finallySaved(dataResponse, windowCallBack, isRefered) {
      if(!isRefered) {
        $scope.queryUser();
        $scope.countUser(); 
        $scope.clearUser();
      } else {
        if(dataResponse.data && dataResponse.data._id)
          share.refAddObject("user", dataResponse.data);
      }
      if(windowCallBack)
        share.window(windowCallBack); 
      else
        share.windowBack();
    }

    function save() {
      var userJson = $scope.user;
      if($scope.user._id != null)
        User.update(userJson, function(dataResponse){ 
          if(validate(share.alert, $scope.errors.user, dataResponse))
            finallySaved(dataResponse, windowCallBack, isRefered);
        });
      else
        User.save(userJson, function(dataResponse){ 
          if(validate(share.alert, $scope.errors.user, dataResponse))
            finallySaved(dataResponse, windowCallBack, isRefered);
        });
    } 
    save();
  }

  $scope.destroyUserByIndex = function(index) {
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
  }

  $scope.queryUser = function(queryMode) {
    share.alertLoad();
    if(queryMode === "reset")
      $scope.dataList.reset();

    if(queryMode === "all") {
      User.query(null, function(dataResponse){ 
        $scope.users = dataResponse;
        $scope.dataList.data = dataResponse.slice(0, 10);
        $scope.dataList.status.listing = $scope.dataList.data.length;
        share.alertClean();
      });
    } else {
      User.query($scope.dataList.toParams(), function(dataResponse){ 
        $scope.dataList.data = dataResponse;
        $scope.dataList.status.listing = $scope.dataList.data.length;
        share.alertClean();
      });
    }

  }
  $scope.queryUser();

  $scope.countUser = function() {
    User.count($scope.dataList.toParams(), function(dataResponse){
      $scope.dataList.status = dataResponse;
      $scope.dataList.status.listing = $scope.dataList.data.length;
    });
  }
  $scope.countUser();

  $scope.queryMoreUser = function() {
    share.alertLoad();
    $scope.dataList.page.skip = $scope.dataList.data.length;
    User.query($scope.dataList.toParams(), function(dataResponse){
      angular.forEach(dataResponse, function(data){
        $scope.dataList.data.push(data);
        $scope.dataList.status.listing++;
      });
      share.alertClean();
    });
  }

  $scope.selectUser = function(index) {
    $scope.user = $scope.dataList.data[index];

      var activitysIds = new Array();
      angular.forEach($scope.user.activitys, function(activity){
        activitysIds.push(activity._id);
      });
      $scope.user._activitys = angular.copy($scope.user.activitys);
      $scope.user.activitys = activitysIds;

  }

  $scope.clearUser = function() {
    delete $scope.user;
    $scope.user = {enabled : true};
    $scope.errors = {};
    $scope.errors.user = {};

  }
  $scope.queryActivity = function(){
    $scope.activitys = Activity.query();
  };
  $scope.queryActivity();

}

