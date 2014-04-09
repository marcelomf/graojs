var Q = require("q");
var _ = require("lodash");

function promise(data){
  var def = Q.defer();
  var saveData = data;
  //var saveData = _.cloneDeep(data);
  console.log(saveData);

  setTimeout(function(){
  	saveData.info3 = saveData.info1+saveData.info2;
  	def.resolve(saveData);
  }, 3000);

  return def.promise;
}

var data = {info1: 1, info2: 2};

promise(data)
.then(function(result){
  console.log(result);
})
.catch(function(err){
  console.log(new Error(err));
});

data.info1 = 3;
data.info2 = 4;

promise(data)
.then(function(result){
  console.log(result);
})
.catch(function(err){
  console.log(new Error(err));
});

data.info1 = 5;
data.info2 = 6;

promise(data)
.then(function(result){
  console.log(result);
})
.catch(function(err){
  console.log(new Error(err));
});