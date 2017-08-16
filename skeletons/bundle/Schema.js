// checkbox boolean currency number primary date radio email text password select textarea url sub_document
  {%- macro render_field(schema, fieldName, field, isFilter, isSubDocArrayField) %}
      {%- set inputtypes = ['text', 'password', 'email', 'url', 'number', 'currency' ] %}
      {%- if inputtypes.indexOf(field.type) !== -1 %}
          {{ input(field.type, schema, fieldName, field, isFilter, isSubDocArrayField) }}
      {%- elseif field.type == 'primary' %}
          {{ input_primary(schema, fieldName, field, isFilter, isSubDocArrayField) }}
      {%- elseif field.type == 'date' %}
          {{ input_date(schema, fieldName, field, isFilter, isSubDocArrayField) }}
      {%- elseif field.type == 'checkbox' %}
          {{ input_checkbox(schema, fieldName, field, isFilter, isSubDocArrayField) }}
      {%- elseif field.type == 'boolean' %}
          {{ input_checkbox(schema, fieldName, field, isFilter, isSubDocArrayField) }}
      {%- elseif field.type == 'radio' %}
          {{ input_radio(schema, fieldName, field, isFilter, isSubDocArrayField) }}
      {%- elseif field.type == 'textarea' %}
          {{ textarea(schema, fieldName, field, isFilter, isSubDocArrayField) }}
      {%- elseif field.type == 'select' %}
          {{ select(schema, fieldName, field, isFilter, isSubDocArrayField) }}
      {%- elseif field.type == 'union' %}
          {{ union(schema, fieldName, field, isFilter, isSubDocArrayField) }}
      {%- elseif field.isSubDoc == true && !field.isArray %}
          {{ subDoc(schema, fieldName, field, isFilter, isSubDocArrayField) }}
      {%- elseif field.isSubDoc == true && field.isArray %}
          {{ subDocArray(schema, fieldName, field, isFilter, isSubDocArrayField) }}
      {%- else %}
          {{ input('text', schema, fieldName, field, isFilter, isSubDocArrayField) }}
      {%- endif %}
  {%- endmacro %}
  
  {%- macro input(type, schema, fieldName, field, isFilter, isSubDocArrayField) %}
  {%- endmacro %} 

  {%- macro input_date(schema, fieldName, field, isFilter, isSubDocArrayField) %}
  {%- endmacro %} 

  {%- macro input_checkbox(schema, fieldName, field, isFilter, isSubDocArrayField) %}
  {%- endmacro %}

  {%- macro input_radio(schema, fieldName, field, isFilter, isSubDocArrayField) %}
  {%- endmacro %}

  {%- macro textarea(schema, fieldName, field, isFilter, isSubDocArrayField) %}
  {%- endmacro %}

  {%- macro select(schema, fieldName, field, isFilter, isSubDocArrayField) %}
  {%- endmacro %}

  {%- macro boolean(schema, fieldName, field, isFilter, isSubDocArrayField) %}
  {%- endmacro %}
  
  {%- macro primary(schema, fieldName, field, isFilter, isSubDocArrayField) %}
  {%- endmacro %}

  {%- macro subDoc(schema, fieldName, field, isFilter, isSubDocArrayField) %}
  {%- endmacro %}

  {%- macro subDocArray(schema, fieldName, field, isFilter, isSubDocArrayField) %}
  {%- endmacro %}
var {{ schema }}Schema = function(di) {
  var validate = di.validate;
  var validator = di.validators.{{ schema | lower}};

  this.fields = {
    {%- for fieldName, field in fields %}{{ render_field(schema, fieldName, field, false) }} {%- endfor %}
    id : di.mongoose.Schema.ObjectId,
    person : {
      type : di.mongoose.Schema.ObjectId,
      ref: "Person",
      index: true,
      unique: true,
      sparse: true,
    },
    situation : {
      type : di.mongoose.Schema.ObjectId,
      ref: "Customersituation",
    },
    budget_services : [{
      type : di.mongoose.Schema.ObjectId,
      ref: "Service",
    }],
    users : [{
      type : di.mongoose.Schema.ObjectId,
      ref: "User",
    }]
  };

  this.mongoose = new di.mongoose.Schema(this.fields);
};

module.exports = exports = {{ schema }}Schema;







var methods = {}, statics = {}, $i;

var {{ schema | capitalize }} = function(di) {
  $i = di;
  $i.schemas.{{ schema | lower }}.mongoose.methods = methods;
  $i.schemas.{{ schema | lower }}.mongoose.statics = statics;
  return $i.mongoose.model("{{ schema | capitalize }}", $i.schemas.{{ schema | lower }}.mongoose, "{{ schema | lower }}");
};

module.exports = exports = {{ schema | capitalize }};