function TopbarPublicController($scope, $timeout, $http, share, $log) {
  $scope.share = share;
  $scope.username = '';
  $scope.password = '';

  setInterval(function(){
      var eventAlert = share.eventsArray.shift();
      if(eventAlert) {
        share.alert.show = false;
        share.alert.message = eventAlert.name+": "+eventAlert.message;
        share.alert.style = 'info';
        share.alert.show = true;
        // ? console.log(share.alert);
      } else {
        share.events();
      }
  },3000);

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
