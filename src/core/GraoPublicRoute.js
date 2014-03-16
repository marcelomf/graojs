var GraoPublicRoute = {
  enable : function(di) {
    di.event.newSuccess('Setting routes of public static content....');
    
    var publicRoutes = di.loader.loading('publicRoute');
    
    for(indexPublicRoute in publicRoutes){
      di.graoExpress.use(indexPublicRoute, 
        di.express.static(di.config.rootPath+publicRoutes[indexPublicRoute]));
    }
  },
};

module.exports = exports = GraoPublicRoute;