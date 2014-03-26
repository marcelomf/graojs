var methods = {}, statics = {}, $i;

var {{ schema | capitalize }} = function(di) {
  $i = di;
  $i.schemas.{{ schema | lower }}.mongoose.methods = methods;
  $i.schemas.{{ schema | lower }}.mongoose.statics = statics;
  return $i.mongoose.model("{{ schema | capitalize }}", $i.schemas.{{ schema | lower }}.mongoose, "{{ schema | lower }}");
};

module.exports = exports = {{ schema | capitalize }};