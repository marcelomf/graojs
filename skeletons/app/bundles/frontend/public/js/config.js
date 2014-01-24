graoJS = angular.module('graoJS', ['ngResource', 'ui.bootstrap','ui.select2']);
graoJS.constant("config", {
  baseUrl: window.location.protocol+"//"+
    window.location.hostname+":"+
	window.location.port+"\:"+
	window.location.port
});