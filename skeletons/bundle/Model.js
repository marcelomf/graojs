var methods = {}, statics = {}, mongooseSchema = { pre: function(){}, post: function(){} }, $i;

var {{ schema | capitalize }} = function(di) {
  $i = di;
  mongooseSchema = $i.schemas.{{ schema | lower }}.mongoose;
  mongooseSchema.methods = methods;
  mongooseSchema.statics = statics;
  return $i.mongoose.model("{{ schema | capitalize }}", mongooseSchema, "{{ schema | lower }}");
};

module.exports = exports = {{ schema | capitalize }};