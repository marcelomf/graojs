var methods = {}, statics = {}, $i;

statics.buildActivitys = function(activityJson) {
  var def = $i.Q.defer();

  var activitysIds = activityJson.activitys || [];

  if(activitysIds.length <= 0) {
    activityJson.activitys = activitysIds;
    def.resolve(activityJson);
  	return def.promise;
  }

  $i.models.activity.find({_id : { $in : activitysIds } }).exec(function(err, activitys){
  	if(err)
      def.reject(new Error(err));

  	for(var i in activitys){
  	  for(var x in activitys[i].activitys.toObject()){
  	  	activitysIds.push(activitys[i].activitys[x].toString());
  	  }
  	}

  	activityJson.activitys = $i._.uniq(activitysIds);

  	def.resolve(activityJson);
  });

  return def.promise;
}

var Activity = function(di) {
  $i = di;
  $i.schemas.activity.mongoose.methods = methods;
  $i.schemas.activity.mongoose.statics = statics;
  return $i.mongoose.model("Activity", $i.schemas.activity.mongoose, "activity");
};

module.exports = exports = Activity;