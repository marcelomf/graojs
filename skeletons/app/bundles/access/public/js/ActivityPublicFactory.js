graoJS.factory('Activity', ['$resource', function($resource) {
  var Activity = $resource('/service/activity/:id', { id: '@_id' }, {
    update: {
      method: 'PUT'
    },
    validate: {
      method: 'POST',
      url: '/service/activity/validate'
    },
    count: {
      method: 'GET',
      url: '/service/activity/count'
    }
  });
  return Activity;
}]);