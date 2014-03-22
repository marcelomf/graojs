var methods = {}, statics = {}, mongoose, $i;

var {{ schema | capitalize }} = function(di) {
  $i = di;
  mongoose = $i.schemas.{{ schema | lower }}.mongoose;
  mongoose.methods = methods;
  mongoose.statics = statics;
  return $i.mongoose.model("{{ schema | capitalize }}", mongoose, "{{ schema | lower }}");
};

module.exports = exports = {{ schema | capitalize }};