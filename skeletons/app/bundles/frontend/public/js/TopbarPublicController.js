function TopbarPublicController($scope, $timeout, $http, share, $log) {
  $scope.share = share;
  $scope.username = '';
  $scope.password = '';

  $scope.login = function(){
    $http.post('/login', {username: $scope.username, password: $scope.password})
      .success(function (data, status, headers, config){
        console.log('SUCESSO');
        console.log(data);
        if(data.statusLogin)
          window.location.href = '/admin/user';
        else
          alert(data.mensage);
      })
      .error(function (data, status, headers, config){
        console.log('ERROR');
        console.log(data);
      });
  };

  $scope.logout = function(){
    $http.get('/logout', {username: $scope.username, password: $scope.password})
      .success(function (data, status, headers, config){
        console.log('SUCESSO');
        console.log(data);
        if(data.statusLogout)
          window.location.href = '/';
        else
          alert(data.mensage);
      })
      .error(function (data, status, headers, config){
        console.log('ERROR');
        console.log(data);
      });
  };
}
