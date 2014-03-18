graoJS.factory('User', ['$resource', function($resource) {
  var User = $resource('/service/user/:id', { id: '@_id' }, {
    update: {
      method: 'PUT'
    },
    validate: {
      method: 'POST',
      url: '/service/user/validate'
    },
    count: {
      method: 'GET',
      url: '/service/user/count'
    },
    updateProfile: {
      method: 'PUT',
      url: '/service/user/update/profile'
    }
  });
  return User;
}]);