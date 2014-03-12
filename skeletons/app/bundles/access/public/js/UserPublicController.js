
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
      $scope.user.activitys = activitysIds;

  }

  $scope.clear = function() {
    delete $scope.user;
    $scope.user = {generatePassword: true, enabled: true};
    $scope.clearUserActivitys();
  }
  $scope.queryActivity = function(){
    $scope.activitys = Activity.query();
  };
  $scope.queryActivity();

  $scope.user.activitys = new Array();
  $scope.newUserActivitys = {};
  $scope.errors.newUserActivitys = {};

  $scope.createOrUpdateUserActivitys = function() {
    function save(dataResponse) {
      if(validate(share.alert, $scope.errors.newUserActivitys, dataResponse)) {
        $scope.activitys.push(dataResponse.data);

        if(!($scope.user.activitys instanceof Array))
          $scope.user.activitys = new Array();
        $scope.user.activitys.push(dataResponse.data._id);

        $scope.clearUserActivitys();
        share.windowBack();
      }
    }
    if($scope.newUserActivitys._id != null)
      Activity.update($scope.newUserActivitys, save);
    else
      Activity.save($scope.newUserActivitys, save);
  }

  $scope.clearUserActivitys = function() {
    delete $scope.newUserActivitys;
    $scope.newUserActivitys = {};
  }

  $scope.activity = {};

  $scope.activity.activitys = new Array();
  $scope.newActivityActivitys = {};
  $scope.errors.newActivityActivitys = {};

  $scope.createOrUpdateActivityActivitys = function() {
    function save(dataResponse) {
      if(validate(share.alert, $scope.errors.newActivityActivitys, dataResponse)) {
        $scope.activitys.push(dataResponse.data);

        if(!($scope.activity.activitys instanceof Array))
          $scope.activity.activitys = new Array();
        $scope.activity.activitys.push(dataResponse.data._id);

        $scope.clearActivityActivitys();
        share.windowBack();
      }
    }
    if($scope.newActivityActivitys._id != null)
      Activity.update($scope.newActivityActivitys, save);
    else
      Activity.save($scope.newActivityActivitys, save);
  }

  $scope.clearActivityActivitys = function() {
    delete $scope.newActivityActivitys;
    $scope.newActivityActivitys = {};
  }

}