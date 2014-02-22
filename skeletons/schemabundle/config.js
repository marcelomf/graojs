module.exports = exports = {
  injection : {
  	controller: [
      { name: "{{schema | lower}}", object: "{{schema | capitalize}}Controller.js" }
    ],
  	model: [
      { name: "{{schema | lower}}", object: "{{schema | capitalize}}.js" }
    ],
  	route: [
      { name: "{{schema | lower}}", object: "{{schema | capitalize}}Route.js" }
    ],
  	validator: [
      { name: "{{schema | lower}}", object: "{{schema | capitalize}}Validator.js" }
    ],
  	schema: [
      { name: "{{schema | lower}}", object: "{{schema | capitalize}}Schema.js" }
    ]
  },
  publicRoutes : [
    { fsdir: "/bundles/{{schema | lower}}/public/css", webdir: "/css/{{schema | lower}}" },
    { fsdir: "/bundles/{{schema | lower}}/public/js", webdir: "/js/{{schema | lower}}" },
    { fsdir: "/bundles/{{schema | lower}}/public/image", webdir: "/image/{{schema | lower}}" },
    { fsdir: "/bundles/{{schema | lower}}/public/font", webdir: "/font/{{schema | lower}}" },
    { fsdir: "/bundles/{{schema | lower}}/public/file", webdir: "/file/{{schema | lower}}" }
  ]
}