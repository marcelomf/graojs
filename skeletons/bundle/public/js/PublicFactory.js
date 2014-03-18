graoJS.factory('{{ schema | capitalize }}', ['$resource', function($resource) {
  var {{ schema | capitalize }} = $resource('/service/{{ schema | lower }}/:id', { id: '@_id' }, {
    update: {
      method: 'PUT'
    },
    validate: {
      method: 'POST',
      url: '/service/{{ schema | lower }}/validate'
    },
    count: {
      method: 'GET',
      url: '/service/{{ schema | lower }}/count'
    }
  });
  return {{ schema | capitalize }};
}]);