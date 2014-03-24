var methods = {}, statics = {}, mongooseSchema = { pre: function(){}, post: function(){} }, $i;

var Activity = function(di) {
  $i = di;
  mongooseSchema = $i.schemas.activity.mongoose;
  mongooseSchema.methods = methods;
  mongooseSchema.statics = statics;
  return $i.mongoose.model("Activity", mongooseSchema, "activity");
};

module.exports = exports = Activity;