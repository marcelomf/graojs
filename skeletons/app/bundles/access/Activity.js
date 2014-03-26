var methods = {}, statics = {}, $i;

var Activity = function(di) {
  $i = di;
  $i.schemas.activity.mongoose.methods = methods;
  $i.schemas.activity.mongoose.statics = statics;
  return $i.mongoose.model("Activity", $i.schemas.activity.mongoose, "activity");
};

module.exports = exports = Activity;