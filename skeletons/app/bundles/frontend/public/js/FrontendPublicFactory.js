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
      selectWindowBack: new Array(),
      window: function(windowName){
        if(this.selectWindowBack != windowName && this.selectWindowBack != this.selectWindow && this.selectWindow != windowName)
          this.selectWindowBack.push(this.selectWindow);
        this.selectWindow = windowName;
      },
      windowBack: function(){
        this.selectWindow = this.selectWindowBack.pop();
      }
  };
  return share;
}]);
