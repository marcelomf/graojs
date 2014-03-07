module.exports = exports = {
  injection : {
    controller: [
      { name: "passport", object: "PassportController.js", di: { Strategy: require('passport-local').Strategy } }
    ],
    route: [
      { name: "frontend", object: "FrontendRoute.js" }
    ]
  },
  publicRoutes : [
    { fsdir: "/bundles/frontend/public/js", webdir: "/js" },
    { fsdir: "/bundles/frontend/public/css", webdir: "/css" },
    { fsdir: "/bundles/frontend/public/img", webdir: "/img" },
    { fsdir: "/bundles/frontend/public/font", webdir: "/font" }
  ]
}
