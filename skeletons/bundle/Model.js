var methods = {}, $i;

var {{ schema | capitalize }} = function(di) {
  $i = di;
  $i.schemas.{{ schema | lower }}.mongoose.methods = methods;
  return di.mongoose.model("{{ schema | capitalize }}", di.schemas.{{ schema | lower }}.mongoose, "{{ schema | lower }}");
};

module.exports = exports = {{ schema | capitalize }};