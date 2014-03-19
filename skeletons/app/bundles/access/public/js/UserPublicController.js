
function UserPublicController($scope, $http, $q, share, User, Activity) {
  $scope.share = share;
  $scope.user = {generatePassword: true, enabled: true};
  $scope.errors = {};
  $scope.errors.user = {};
  $scope.notFilter = true;
  $scope.dataList = new DataList();

  $scope.$watch("dataList", function(newDataList, oldDataList) {
    if(oldDataList.page.current != newDataList.page.current || 
      oldDataList.page.limit != newDataList.page.limit) {
      newDataList.page.skip = newDataList.page.current * newDataList.page.limit - newDataList.page.limit;
      $scope.query();
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

  $scope.createOrUpdate = function(windowCallBack) {
    console.log($scope.user);
    share.alertLoad();
    function save() {
      var userJson = $scope.user;

      if($scope.user._id != null)
        User.update(userJson, function(dataResponse){ 
          if(validate(share.alert, $scope.errors.user, dataResponse)){ 
            $scope.query(); 
            $scope.count(); 
            $scope.clear(); 
            share.window(windowCallBack); 
          }
        });
      else
        User.save(userJson, function(dataResponse){ 
          if(validate(share.alert, $scope.errors.user, dataResponse)){ 
            $scope.query(); 
            $scope.count(); 
            $scope.clear(); 
            share.window(windowCallBack); 
          }
        });
    } 
    save();
  }

  $scope.destroyByIndex = function(index) {
    share.alertLoad();
    $scope.dataList.data[index].$delete(function(dataResponse){
      share.alert.show = true;
      share.alert.style = dataResponse.event.style;
      share.alert.message = dataResponse.event.message;
    });
    $scope.dataList.data.splice(index, 1);
  }

  $scope.filter = function() {
    share.alertLoad();
    $scope.dataList.data = User.query($scope.dataList.toParams(), function(){
      share.alertClean();
    });
  }

  $scope.query = function() {
    share.alertLoad();
    $scope.dataList.data = User.query($scope.dataList.toParams(), function(){ 
      $scope.dataList.status.listing = $scope.dataList.data.length;
      share.alertClean();
    });
  }
  $scope.query();

  $scope.count = function() {
    $scope.dataList.status = User.count($scope.dataList.toParams(), function(dataResponse){
      $scope.dataList.status.listing = $scope.dataList.data.length;
    });
  }
  $scope.count();

  $scope.queryMore = function() {
    share.alertLoad();
    $scope.dataList.page.skip = $scope.dataList.data.length;
    var moreUsers = User.query($scope.dataList.toParams(), function(){
      angular.forEach(moreUsers, function(user){
        $scope.dataList.data.push(user);
        $scope.dataList.status.listing++;
      });
      share.alertClean();
    });
  }

  $scope.select = function(index) {
    $scope.user = $scope.dataList.data[index];

      var activitysIds = new Array();
      angular.forEach($scope.user.activitys, function(activity){
        activitysIds.push(activity._id);
      });
      $scope.user._activitys = angular.copy($scope.user.activitys);
      $scope.user.activitys = activitysIds;

  }

  $scope.clear = function() {
    delete $scope.user;
    $scope.user = {generatePassword: true, enabled: true};
    $scope.clearActivity();
  }
  $scope.queryActivity = function(){
    $scope.activitys = Activity.query();
  };
  $scope.queryActivity();

  $scope.newActivity = {};
  $scope.errors.newActivity = {};

  $scope.createOrUpdateActivity = function() {
    function save(dataResponse) {
      if(validate(share.alert, $scope.errors.newActivity, dataResponse)) {
        $scope.activitys.push(dataResponse.data);
        $scope.clearActivity();
        share.windowBack();
      }
    }
    if($scope.newActivity._id != null)
      Activity.update($scope.newActivity, save);
    else
      Activity.save($scope.newActivity, save);
  }

  $scope.clearActivity = function() {
    delete $scope.newActivity;
    $scope.newActivity = {};
  }
}