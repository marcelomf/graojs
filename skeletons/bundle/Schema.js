  {%- macro render_field(schema, fieldName, field, isFilter, isSubDocArrayField) %}
      {%- set stringtypes = ['input', 'text', 'password', 'email', 'url', 'radio', 'textarea'] %}
      {%- set numbertypes = ['number', 'currency'] %}
      {%- if stringtypes.indexOf(field.type) !== -1 %}
          {{ string(field.type, schema, fieldName, field, isFilter, isSubDocArrayField) }}
      {%- elseif numbertypes.indexOf(field.type) !== -1 %}
          {{ number(schema, fieldName, field, isFilter, isSubDocArrayField) }}
      {%- elseif field.type == 'primary' %}
          {{ primary(schema, fieldName, field, isFilter, isSubDocArrayField) }}
      {%- elseif field.type == 'date' %}
          {{ date(schema, fieldName, field, isFilter, isSubDocArrayField) }}
      {%- elseif field.type == 'boolean' || field.type == 'checkbox' %}
          {{ boolean(schema, fieldName, field, isFilter, isSubDocArrayField) }}
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
  
  {%- macro string(type, schema, fieldName, field, isFilter, isSubDocArrayField) %}
    {{ fieldName }} : {%- if field.isArray %}[{%- endif %}{
        type : String{%- if field.required %},
        required: true{%- endif %}
    }{%- if field.isArray %}]{%- endif %},
  {%- endmacro %} 

  {%- macro number(type, schema, fieldName, field, isFilter, isSubDocArrayField) %}
    {{ fieldName }} : {%- if field.isArray %}[{%- endif %}{
        type : Number{%- if field.required %},
        required: true{%- endif %}
    }{%- if field.isArray %}]{%- endif %},
  {%- endmacro %} 

  {%- macro date(schema, fieldName, field, isFilter, isSubDocArrayField) %}
    {{ fieldName }} : {%- if field.isArray %}[{%- endif %}{
        type : Date{%- if field.required %},
        required: true{%- endif %}
    }{%- if field.isArray %}]{%- endif %},
  {%- endmacro %} 

  {%- macro select(schema, fieldName, field, isFilter, isSubDocArrayField) %}
    {{ fieldName }} : {%- if field.isArray %}[{%- endif %}{
        {%- if field.ref %}
        type : di.mongoose.Schema.ObjectId,
        ref: "{{ field.ref }}"{%- if field.required %},
        required: true{%- endif %}
        {%- else %}
        type : String,
        lowercase : true{%- if field.required %},
        required: true{%- endif %}
        {%- endif %}
    }{%- if field.isArray %}]{%- endif %},
  {%- endmacro %}

  {%- macro boolean(schema, fieldName, field, isFilter, isSubDocArrayField) %}
    {{ fieldName }} : {%- if field.isArray %}[{%- endif %}{
      type: Boolean{%- if field.required %},
      required: true{%- endif %}
    }{%- if field.isArray %}]{%- endif %},
  {%- endmacro %}
  
  {%- macro primary(schema, fieldName, field, isFilter, isSubDocArrayField) %}
    {{ fieldName }} : di.mongoose.Schema.ObjectId,
  {%- endmacro %}

  {%- macro subDoc(schema, fieldName, field, isFilter, isSubDocArrayField) %}
  {{ fieldName }} : {
    {%- for subFieldName, subField in field.fields %}
    {{ render_field(schema, subFieldName, subField, false, true) }}
    {%- endfor %}
  },
  {%- endmacro %}

  {%- macro subDocArray(schema, fieldName, field, isFilter, isSubDocArrayField) %}
  {{ fieldName }} : [{
    {%- for subFieldName, subField in field.fields %}
    {{ render_field(schema, subFieldName, subField, false, true) }}
    {%- endfor %}
  }],
  {%- endmacro %}
var {{ schema | capitalize }}Schema = function(di) {
  var validate = di.validate;
  var validator = di.validators.{{ schema | lower}};
  
  this.fields = {
    {%- for fieldName, field in fields %}{{ render_field(schema, fieldName, field, false) }} {%- endfor %}
  };
  
  this.mongoose = new di.mongoose.Schema(this.fields);
};

module.exports = exports = {{ schema | capitalize }}Schema;
