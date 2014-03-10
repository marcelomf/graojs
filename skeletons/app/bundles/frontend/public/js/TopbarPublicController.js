function TopbarPublicController($scope, $timeout, $http, share, $log) {
  $scope.share = share;
  $scope.username = '';
  $scope.password = '';

  $scope.login = function(){
    share.alertInfo("Loading...");
    $http.post('/login', {username: $scope.username, password: $scope.password})
      .success(function (data, status, headers, config){
        if(data.event){
          share.alert.message = data.event.message;
          share.alert.style = data.event.style;
          share.alert.show = true;
          if(data.event.status)
            window.location.href = '/admin/user';
        } else {
          share.alertDanger(data);
        }
      })
      .error(function (data, status, headers, config){
        share.alertDanger(data);
      });
  };

  $scope.logout = function(){
    $http.get('/logout')
      .success(function (data, status, headers, config){
        if(data.event) {
          share.alert.message = data.event.message;
          share.alert.style = data.event.style;
          share.alert.show = true;
          if(data.event.status)
            window.location.href = '/';
        } else {
          share.alertDanger(data);
        }
      })
      .error(function (data, status, headers, config){
        share.alertDanger(data);
      });
  };
}
