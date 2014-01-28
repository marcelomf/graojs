function TopbarPublicController($scope, $timeout, $http, share, $log) {
  $scope.share = share;
  $scope.username = '';
  $scope.password = '';

  $scope.eventTimer = function(){
    $scope.share.events();
    eventTime = $timeout($scope.eventTimer, 3000);
  };
   
  var eventTimer = $timeout($scope.eventTimer, 3000);
      
  $scope.stop = function(){
    $timeout.cancel(eventTimer);
  };

  $scope.login = function(){
    $http.post('/login', {username: $scope.username, password: $scope.password})
      .success(function (data, status, headers, config){
        console.log('SUCESSO');
        console.log(data);
      })
      .error(function (data, status, headers, config){
        console.log('ERROR');
        console.log(data);
      });
  };
}
