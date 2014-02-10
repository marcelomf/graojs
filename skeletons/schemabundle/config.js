module.exports = exports = {
  injection : {
  	controller: [{
  		name: "{{schema | lower}}",
  		object: "{{schema | capitalize}}Controller.js" 
  	}],
  	model: [{
  		name: "{{schema | lower}}",
  		object: "{{schema | capitalize}}.js" 
  	}],
  	route: [{
  		name: "{{schema | lower}}",
  		object: "{{schema | capitalize}}Route.js" 
  	}],
  	validator: [{
  		name: "{{schema | lower}}",
  		object: "{{schema | capitalize}}Validator.js" 
  	}],
  	schema: [{
  		name: "{{schema | lower}}",
  		object: "{{schema | capitalize}}Schema.js" 
  	}]
  }
}