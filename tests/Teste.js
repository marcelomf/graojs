var TesteDi = require("./TesteDi.js"),
    Inject = require("./Inject.js"),
    inject = new Inject(),
    objects = new Array();



for(var i = 0; i <= 30000000; i++){
  var testeDi = new TesteDi({inject: inject});
  objects.push(testeDi);
}
