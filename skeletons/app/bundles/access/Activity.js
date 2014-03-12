var methods = {};

var Activity = function(di) {
  di.schemas.activity.mongoose.methods = methods;
  return di.mongoose.model("Activity", di.schemas.activity.mongoose, "activity");
};

module.exports = exports = Activity;