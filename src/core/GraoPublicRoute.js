var GraoPublicRoute = {
	enable : function(di) {
		di.event.new('Setting routes of public static content....').success().present().log('info');
		
		var dynamicPublicRoutes = di.loader.loading('publicRoute');
		
		for(indexPublicRoute in dynamicPublicRoutes)
		{
			this.publicRoutes[indexPublicRoute] = dynamicPublicRoutes[indexPublicRoute];
		}
		
		for (var publicRoute in this.publicRoutes) {
			di.graoExpress.use(publicRoute, di.express.static(di.config.rootPath
					+ this.publicRoutes[publicRoute]));
		}
	},

	/**
	 * Need be automatic with nodejs fs package
	 */
	publicRoutes : {
		'/css/bootstrap' : '/node_modules/graojs/vendor/bootstrap/public/css',
		'/js/bootstrap' : '/node_modules/graojs/vendor/bootstrap/public/js',
		'/css/jquery' : '/node_modules/graojs/vendor/jquery/public/css',
		'/js/jquery' : '/node_modules/graojs/vendor/jquery/public/js',
		'/img/jquery' : '/node_modules/graojs/vendor/jquery/public/img',
		'/ui' : '/node_modules/graojs/vendor/bootstrap/public/ui',

		'/css/font-awesome' : '/node_modules/graojs/vendor/font-awesome/public/css',
		'/css/font' : '/node_modules/graojs/vendor/font-awesome/public/font',

		'/js/angularjs' : '/node_modules/graojs/vendor/angularjs/public/js'
	}
};

module.exports = exports = GraoPublicRoute;
