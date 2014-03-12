graoJS.factory('User', ['$resource', function($resource) {
  var User = $resource('/user/:id', { id: '@_id' }, {
    update: {
      method: 'PUT'
    },
    validate: {
      method: 'POST',
      url: '/user/validate'
    },
    count: {
      method: 'GET',
      url: '/user/count'
    },
    updateProfile: {
      method: 'PUT',
      url: '/user/update/profile'
    }
  });
  return User;
}]);