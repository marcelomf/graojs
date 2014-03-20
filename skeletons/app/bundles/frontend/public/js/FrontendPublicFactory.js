graoJS.factory('share', ['config', '$timeout', '$http', function(config, $timeout, $http) {
  var share = {
      alert: { message: 'graoJS', style: 'info', show: false },
      alertPrimary: function(message){
        this.alert.message = message;
        this.alert.style = 'primary';
        this.alert.show = true;
      },
      alertSuccess: function(message){
        this.alert.message = message;
        this.alert.style = 'success';
        this.alert.show = true;
      },
      alertInfo: function(message){
        this.alert.message = message;
        this.alert.style = 'info';
        this.alert.show = true;
      },
      alertWarning: function(message){
        this.alert.message = message;
        this.alert.style = 'warning';
        this.alert.show = true;
      },
      alertDanger: function(message){
        this.alert.message = message;
        this.alert.style = 'danger';
        this.alert.show = true;
      },
      alertLoad: function(){
        this.alertInfo("Loading...");
      },
      alertClean: function(){
        this.alert.message = '';
        this.alert.style = '';
        this.alert.show = false;
      },
      selectWindow: "",
      selectWindowBack: new Array(),
      window: function(windowName){
        if(this.selectWindowBack != windowName && 
          this.selectWindowBack != this.selectWindow && 
          this.selectWindow != windowName)
          this.selectWindowBack.push(this.selectWindow);
        this.selectWindow = windowName;
      },
      windowBack: function(){
        this.selectWindow = this.selectWindowBack.pop();
      },
      ref : {
        schemaObject : null,
        schemaList : null,
        isArray: false,
        object: null,
        objectField : null,
        field : null,
        list : null
      },
      refHistory : {},
      refAdd : function(ref) {
        this.ref = ref;
        if(this.ref.schemaObject)
          this.refHistory[this.ref.schemaObject] = angular.copy(this.ref);
      },
      refClean : function() {
        if(this.ref.schemaObject)
          this.refHistory[this.ref.schemaObject] = angular.copy(this.ref);
        this.ref = {
          schemaObject : null,
          schemaList : null,
          isArray: false,
          object: null,
          objectField : null,
          field : null,
          list : null
        };
      }
  };
  return share;
}]);