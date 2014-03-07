module.exports = exports = {
  injection : {
  	controller: [{%if bundle == schema %}
      { name: "{{schema | lower}}", object: "{{schema | capitalize}}Controller.js" },{% else %}{% for key, bundleSchema in allSchemas %}
      { name: "{{bundleSchema | lower}}", object: "{{bundleSchema | capitalize}}Controller.js" },{% endfor %}{% endif %}
    ],
    model: [{%if bundle == schema %}
      { name: "{{schema | lower}}", object: "{{schema | capitalize}}.js" },{% else %}{% for key, bundleSchema in allSchemas %}
      { name: "{{bundleSchema | lower}}", object: "{{bundleSchema | capitalize}}.js" },{% endfor %}{% endif %}
    ],
    route: [{%if bundle == schema %}
      { name: "{{schema | lower}}", object: "{{schema | capitalize}}Route.js" },{% else %}{% for key, bundleSchema in allSchemas %}
      { name: "{{bundleSchema | lower}}", object: "{{bundleSchema | capitalize}}Route.js" },{% endfor %}{% endif %}
    ],
    validator: [{%if bundle == schema %}
      { name: "{{schema | lower}}", object: "{{schema | capitalize}}Validator.js" },{% else %}{% for key, bundleSchema in allSchemas %}
      { name: "{{bundleSchema | lower}}", object: "{{bundleSchema | capitalize}}Validator.js" },{% endfor %}{% endif %}
    ],
    schema: [{%if bundle == schema %}
      { name: "{{schema | lower}}", object: "{{schema | capitalize}}Schema.js" },{% else %}{% for key, bundleSchema in allSchemas %}
      { name: "{{bundleSchema | lower}}", object: "{{bundleSchema | capitalize}}Schema.js" },{% endfor %}{% endif %}
    ],
  },
  publicRoutes : [{%if bundle == schema %}
    { fsdir: "/bundles/{{bundle | lower}}/public/css", webdir: "/css/{{schema | lower}}" },
    { fsdir: "/bundles/{{bundle | lower}}/public/js", webdir: "/js/{{schema | lower}}" },
    { fsdir: "/bundles/{{bundle | lower}}/public/image", webdir: "/image/{{schema | lower}}" },
    { fsdir: "/bundles/{{bundle | lower}}/public/font", webdir: "/font/{{schema | lower}}" },
    { fsdir: "/bundles/{{bundle | lower}}/public/file", webdir: "/file/{{schema | lower}}" },{% else %}{% for key, bundleSchema in allSchemas %}
    { fsdir: "/bundles/{{bundle | lower}}/public/css", webdir: "/css/{{bundleSchema | lower}}" },
    { fsdir: "/bundles/{{bundle | lower}}/public/js", webdir: "/js/{{bundleSchema | lower}}" },
    { fsdir: "/bundles/{{bundle | lower}}/public/image", webdir: "/image/{{bundleSchema | lower}}" },
    { fsdir: "/bundles/{{bundle | lower}}/public/font", webdir: "/font/{{bundleSchema | lower}}" },
    { fsdir: "/bundles/{{bundle | lower}}/public/file", webdir: "/file/{{bundleSchema | lower}}" },
    {% endfor %}{% endif %}
  ]
}