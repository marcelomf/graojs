module.exports = exports = {
  injection : {
    controller: [
      { name: "passport", object: "PassportController.js", di: { Strategy: require('passport-local').Strategy ,
                                                                 url: require("url") } },
      { name: "user", object: "UserController.js" },
      { name: "activity", object: "ActivityController.js" },
    ],
    model: [
      { name: "user", object: "User.js" },
      { name: "activity", object: "Activity.js" },
    ],
    route: [
      { name: "user", object: "UserRoute.js" },
      { name: "activity", object: "ActivityRoute.js" },
    ],
    validator: [
      { name: "user", object: "UserValidator.js" },
      { name: "activity", object: "ActivityValidator.js" },
    ],
    schema: [
      { name: "user", object: "UserSchema.js" },
      { name: "activity", object: "ActivitySchema.js" },
    ],
  },
  publicRoutes : [
    { fsdir: "/bundles/access/public/css", webdir: "/css/user" },
    { fsdir: "/bundles/access/public/js", webdir: "/js/user" },
    { fsdir: "/bundles/access/public/image", webdir: "/image/user" },
    { fsdir: "/bundles/access/public/font", webdir: "/font/user" },
    { fsdir: "/bundles/access/public/file", webdir: "/file/user" },

    { fsdir: "/bundles/access/public/css", webdir: "/css/activity" },
    { fsdir: "/bundles/access/public/js", webdir: "/js/activity" },
    { fsdir: "/bundles/access/public/image", webdir: "/image/activity" },
    { fsdir: "/bundles/access/public/font", webdir: "/font/activity" },
    { fsdir: "/bundles/access/public/file", webdir: "/file/activity" },

  ]
}
