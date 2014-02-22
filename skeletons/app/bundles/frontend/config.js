module.exports = exports = {
  injection : {
    route: [
      { name: "frontend", object: "FrontendRoute.js" }
    ]
  },
  publicRoutes : [
    { fsdir: "/node_modules/graojs/vendor/bootstrap/public/css", webdir: "/css/bootstrap" },
    { fsdir: "/node_modules/graojs/vendor/bootstrap/public/js", webdir: "/js/bootstrap" },
    { fsdir: "/node_modules/graojs/vendor/jquery/public/css", webdir: "/css/jquery" },
    { fsdir: "/node_modules/graojs/vendor/jquery/public/js", webdir: "/js/jquery" },
    { fsdir: "/node_modules/graojs/vendor/jquery/public/img", webdir: "/image/jquery" },
    { fsdir: "/node_modules/graojs/vendor/bootstrap/public/ui", webdir: "/ui" },
    { fsdir: "/node_modules/graojs/vendor/font-awesome/public/css", webdir: "/css/font-awesome" },
    { fsdir: "/node_modules/graojs/vendor/font-awesome/public/font", webdir: "/css/font" },
    { fsdir: "/node_modules/graojs/vendor/angularjs/public/js", webdir: "/js/angujarjs" }
  ]
}
