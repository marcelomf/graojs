graoJS.factory('{{ schema | capitalize }}', ['$resource', function($resource) {
  var {{ schema | capitalize }} = $resource('/{{ schema | lower }}/:id', { id: '@_id' }, {
    update: {
      method: 'PUT'
    },
    validate: {
      method: 'POST',
      url: '/{{ schema | lower }}/validate'
    },
    count: {
      method: 'GET',
      url: '/{{ schema | lower }}/count'
    }
  });
  return {{ schema | capitalize }};
}]);