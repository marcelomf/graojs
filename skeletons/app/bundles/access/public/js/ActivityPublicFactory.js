graoJS.factory('Activity', ['$resource', function($resource) {
  var Activity = $resource('/activity/:id', { id: '@_id' }, {
    update: {
      method: 'PUT'
    },
    validate: {
      method: 'POST',
      url: '/activity/validate'
    },
    count: {
      method: 'GET',
      url: '/activity/count'
    }
  });
  return Activity;
}]);