graoJS.factory('share', ['config', '$timeout', '$http', function(config, $timeout, $http) {
  var share = {
      notify: { title: 'Notify...', content: 'Notify Content!', btn: 'N', isAutoOpen: true },
      events: function(){
        $http.get('/events/pull').success(function(events) {
          for(id in events)
          {
            $timeout(function(){
              share.notify.title = events[id].name;
              share.notify.content = events[id].message;  
            },5000);
          }
         });
      },
      selectWindow: "",
      window: function(windowName){
        this.selectWindow = windowName;
      }
  };
  return share;
}]);
