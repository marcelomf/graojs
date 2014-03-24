var service = {}, admin = {}, models, controllers, event, config, Activity, $i;

service.count = function(req, res) {
  var dataList = controllers.processDataList(Activity, req.query);

  Activity.count({}, function(err, totality) {
    if(err) {
      res.json(event.newError(err).toJson());
      return;
    } 

    if(dataList.filter == null) {
      res.json({totality: totality, filtered: 0});
      return;
    }

    Activity.count(dataList.filter, function(err, filtered) {
      if(err)
        res.json(event.newError(err).toJson());
      else
        res.json({totality: totality, filtered: filtered});
    });
  });
}

service.get = function(req, res) {
    Activity.findOne({_id : req.params.id}).populate('activitys').exec(function(err, activity) {
    if (err)
      res.json(event.newError(err).toJson());
    else
      res.json(activity);
  });
}

service.query = function(req, res) {
  var dataList = { page: {}, sort: 'field -_id' };
  if(req.query.filter || req.query.sort || req.query.page)
    dataList = controllers.processDataList(Activity, req.query);

  Activity.find(dataList.filter || null).
    sort(dataList.sort || null).
    skip(dataList.page.skip || null).
    limit(dataList.page.limit || null).
    populate('activity').
    populate('activitys').
    exec(function(err, activitys) {
      if(err)
        res.json(event.newError(err).toJson());
      else
        res.json(activitys);
  });
}

service.validate = function(req, res, next) {
  var activity = new Activity(req.body);
  activity.validate(function(err){
    if(err)
      res.json(event.newError(err).toJson());
    else
      next();
  });
}

service.create = function(req, res) {
  var activity = new Activity(req.body);
  activity.save(function(err, activity) {
    if(err)
      res.json(event.newError(err).toJson());
    else
      res.json(event.newSuccess(res.__("Activity")+" "+res.__("created")).data(activity).toJson());
  });
}

service.update = function(req, res) {
  delete req.body._id;
  Activity.findOneAndUpdate({_id : req.params.id }, req.body, { upsert : true }, function(err, activity) {
    if(err)
      res.json(event.newError(err).toJson());
    else
      res.json(event.newSuccess(res.__("Activity")+" "+res.__("updated")).data(activity).toJson());
  });
}

service.destroy = function(req, res) {  
  Activity.remove({_id : req.params.id}, function(err) {
    if(err)
      res.json(event.newError(err).toJson());
    else
      res.json(event.newSuccess(res.__("Destroyed")).toJson());
  });
}

admin.dashboard = function(req, res) {
  var locale = (config.locales.indexOf(req.cookies.locale) >= 0) ? req.cookies.locale : config.defaultLocale;
  res.render('access/view/activity_dashboard', { isAuth: req.isAuthenticated(), locale: locale, user: req.user});
}

var ActivityController = function(di) {
  $i = di;
  event = new $i.event.newSuccess('Instance created');
  config = $i.config;
  models = $i.models;
  controllers = $i.controllers;
  Activity = models.activity; // object/class
  this.service = service;
  this.admin = admin;
};

module.exports = exports = ActivityController;