var styles,
  states,
  logger,
  stackTrace,
  handle;

/**
 * @FIXME memory leak with circular objs 
 * delete only delete reference, not a object.
 * Maybe, we need utilize literal objects
 */
var GraoEvent = function(di) {
  $ = this; // holder
  
  /*if(di !== null && di !== undefined && di.constructor == {}.constructor)
    {}*/
  
  this.stackTrace = $.stackTrace = stackTrace = (di.stackTrace != null) ? 
                          di.stackTrace : (stackTrace != null) ? 
                                      stackTrace : null;
  
  this.styles = $.styles = styles = (di.styles != null) ?  
                      di.styles : (styles != null) ? 
                                styles : null;
  
  this.states = $.states = states = (di.states != null) ? 
                      di.states : (states != null) ? 
                                states : null;
  
  this.logger = $.logger = logger = (di.logger != null) ?  
                      di.logger : (logger != null) ? 
                                logger : null;

  /*err = new Error;
  console.log(err.stack);*/
  var trace = stackTrace.get();
  /*var i;
  for(i = 0; i < 3; i++)
  {
    console.log(trace[i].getFileName()+" - "+trace[i].getFunctionName()+" - "+trace[i].getMethodName());
  }*/
  /**
   * initialEventRelated
   * finalEventRelated
   */
  
  this.id = 123; // global counter
  this.name = (trace[1].getFunctionName() == "GraoKernel") ? "GraoKernel.js" : trace[2].getFileName();
  this.name = this.name.split(".");
  this.name = this.name[0];
  this.name = this.name.split("/");
  this.name = this.name[this.name.length-1];

  this.message = di.message;
  this.total = di.total;
  this.mandatory = di.mandatory;
  
  handle = (handle == null) ? this : handle;
  handle.events = (handle.events == null) ? new Array() : handle.events;  
  this.handle = $.handle = handle;

  // style = {default,primary,success,info,warning,danger}
  this.style = (di.style != null) ? di.style : styles.DEFAULT;
    
  // this.state == initial, relational, running, finalized
  this.state = (di.state != null) ? di.state : states.RELATIONAL;
  
  // Jump to byPassTo (maybe work with exceptions for bypass), maybe we define priorities
  this.byPassTo = di.byPassTo;
  
  // limit events, except mandatory
  this.limit = di.limit; 
  
  // last is a past handle list
  this.last = di.last;
  
  this.listener = listener;
  
  this.status = false;
  this.payload = di.payload;

  // the current event count
  this.count = function() {
    return $.last.length+1;
  };
  
  this.conclusion = function() {
    var percentage = ($.count()/$.total*100);
    return percentage >= 100 ? 100 : percentage;
  };
  
  this.stateTime = function() {
    switch(this.state)
    {
      case states.INITIAL:
        this.initialTime = new Date();
        break;
      case states.RELATIONAL:
        this.relationalTime = new Date();
        break;
      case states.RUNNING:
        this.runningTime = new Date();
        break;
      case states.FINALIZE:
        this.finalizeTime = new Date();
        break;
      default:
        throw 'Invalid state time('+this.state+')!';
    }
  };
  
  this.new = function(message) {
    var newEvent = new GraoEvent( { message: message } );
    return newEvent;
    //handle.events.push(newEvent);
    //this.message = message;
    //return this;
  };

  this.newError = function(message) {
    var newEvent = new GraoEvent( { message: message } );
    return newEvent.error().log('error');
    //handle.events.push(newEvent);
    //this.message = message;
    //return this;
  };

  this.newSuccess = function(message) {
    var newEvent = new GraoEvent( { message: message } );
    return newEvent.success().log('info');
    //handle.events.push(newEvent);
    //this.message = message;
    //return this;
  };
  
  this.success = function() {
    this.status = true;
    this.state = states.RUNNING;
    this.style = styles.SUCCESS;
    $.stateTime();
    return this;
  };
  
  this.error = function() {
    this.status = false;
    this.state = states.RUNNING;
    this.style = styles.DANGER;
    if(this.message.errors && this.message.message){
      this.payload = this.message.errors;
      this.message = this.message.message;
    } else if(this.message.path && this.message.message) {
      this.payload = ({}[this.message.path]=this.message.message);
      this.message = this.message.message;
    } else if(this.message.name == 'MongoError') {
      this.payload = {};
      this.message = this.message.err ? this.message.err : this.message.errmsg;
    } else {
      this.payload = {};
      this.message = (this.message) ? this.message : 'Unexpected Error';
    }
    $.stateTime();
    return this;
  };

  this.default = function(){
  	this.style = styles.DEFAULT;
  	return this;
  };

  this.data = function(payload){
    this.payload = payload  
  	return this;
  };

  this.primary = function(){
  	this.style = styles.PRIMARY;
  	return this;
  };

  this.info = function(){
  	this.style = styles.INFO;
  	return this;
  };

  this.warning = function(){
  	this.style = styles.WARNING;
  	return this;
  };

  this.present = function() {
    this.presented = true;
    
    if(this.state != states.INITIAL)
      this.state = states.FINALIZE;
    /**
     * @FIXME
      if(this.name != 'kernel')
      $.stateTime();
    */
    return this;
  };
  
  // Need implement default log level on config file
  this.log = function(level) {
    $.logger.log(level, this.name+": "+this.message);
    return this;
  };

  this.toJson = function(){
    return { 
              event: { status: $.status, style: $.style, message: $.message },
              data: $.payload 
           };
  };

  $.stateTime();
  
  this.last = this;
  //handle.events.push(this.last);
  return this;
};

var listener = {
    push: function()
    {
      var eventsPushing = new Array();
      //console.log('Events: ');
      //console.log(handle.events);
      for(var id in handle.events)
      {
        if((handle.events[id].state != states.INITIAL && handle.events[id].state != states.FINALIZE) || 
            !handle.events[id].presented)
          continue;
            
/*        eventsPushing.push({
          id: handle.events[id].id,
          name: handle.events[id].name,
          data: handle.events[id].payload,
          message: handle.events[id].message,
          style: handle.events[id].style,
          state: handle.events[id].state,
          initialTime: handle.events[id].initialTime,
          status: handle.events[id].status,
          presented: handle.events[id].presented,
        });*/
        
        handle.events[id].presented = false;
        
        /**
         * @FIXME memory leak with circular objs 
         */
        if(handle.events[id].state != states.INITIAL)
        {
          delete handle.events[id];
          //handle.events[id] = null;
        }
      }
      /**
       * @FIXME JSON.stringify ...
       */
      return eventsPushing;
    }
  };

module.exports = exports = GraoEvent;
module.exports.listener = exports.listener = listener;