graoJS.factory('share', ['config', '$timeout', '$http', function(config, $timeout, $http) {
  var share = {
      alert: { message: 'graoJS', style: 'info', show: false },
      eventsArray: new Array(),
      events: function(){
        $http.get('/events/pull').success(function(events) {
          for(var i in events)
            share.eventsArray.push(events[i]);
        });
      },
      selectWindow: "",
      window: function(windowName){
        this.selectWindow = windowName;
      }
  };
  return share;
}]);
