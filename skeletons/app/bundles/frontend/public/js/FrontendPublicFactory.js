graoJS.factory('share', ['$timeout', '$http', function(config, $timeout, $http) {
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
      refs : {},
      refsUpdates : {},
      getRefObject : function(schemaObject) {
        if(!this.refs[schemaObject])
          return null;
        if(!this.refs[schemaObject].object)
          return null;
        else
          return this.refs[schemaObject].object;
      },
      refAddObject : function(schemaRef, object) {
        if(!this.refsUpdates[schemaRef]) {
          console.log("Share refs: Schema ref update not found.");
          return;
        }

        if(!this.refsUpdates[schemaRef] || this.refsUpdates[schemaRef].length <= 0) {
          console.log("Share refs: Updates not found.");
          return;
        }

        var ref = this.refsUpdates[schemaRef].pop();

        if(!ref) {
          console.log("Share refs: Ref schemaRef not found.");
          return;
        }

        if(!object) {
          console.log("Share refs: Object not found.");
          return;
        }

        if(!ref.objectField) {
          console.log("Share refs: Object field not found.");
          return; 
        }

        if(ref.refList && ref.refList instanceof Array)
          ref.refList.push(object);

        if(object._id) {
          if(!ref.objectField[ref.field])
            ref.objectField[ref.field] = (ref.isArray == true) ? new Array() : "";

          if(ref.objectField[ref.field] instanceof Array)
            ref.objectField[ref.field].push(object._id);
          else
            ref.objectField[ref.field] = object._id;
        }
      },
      refAdd : function(ref) {
        if(!ref.schemaObject || !ref.schemaRef) {
          console.log("Share refs: Schemas not found.");
          return;  
        }

        if(!this.refsUpdates[ref.schemaRef] || !(this.refsUpdates[ref.schemaRef] instanceof Array)) {
          this.refsUpdates[ref.schemaRef] = new Array();
        }

        this.refsUpdates[ref.schemaRef].push(ref);
        this.refs[ref.schemaObject] = ref;
      },
      refSaveObject : function(ref) {
        if(!ref.schemaObject) {
          console.log("Share refs: Schema object not found.");
          return;  
        }
        this.refs[ref.schemaObject] = ref;
      },
      refClean : function(schemaObject) {
        if(this.refs[schemaObject]) {
          this.refs[schemaObject].schemaObject = null;
          this.refs[schemaObject].schemaRef = null;
          this.refs[schemaObject].object = null;
          this.refs[schemaObject].objectField = null;
          this.refs[schemaObject].refList = null;
          this.refs[schemaObject].field = null;
        }
      }
  };
  return share;
}]);