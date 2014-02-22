var GraoPublicRoute = {
  enable : function(di) {
    di.event.new('Setting routes of public static content....').success().present().log('info');
    
    var publicRoutes = di.loader.loading('publicRoute');
    
    for(indexPublicRoute in publicRoutes){
      di.graoExpress.use(indexPublicRoute, 
        di.express.static(di.config.rootPath+publicRoutes[indexPublicRoute]));
    }
  },
};

module.exports = exports = GraoPublicRoute;