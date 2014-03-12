var models, controllers, event, config, Activity;
var service = {};
var admin = {};

service.count = function(req, res) {
  var dataList = controllers.processDataList(Activity, req.query);

  Activity.count({}, function(err, totality) {
    if(err) {
      res.json(event.new(err).error().log('error').toJson());
      return;
    } 

    if(dataList.filter == null) {
      res.json({totality: totality, filtered: 0});
      return;
    }

    Activity.count(dataList.filter, function(err, filtered) {
      if(err)
        res.json(event.new(err).error().log('error').toJson());
      else
        res.json({totality: totality, filtered: filtered});
    });
  });
}

service.get = function(req, res) {
    Activity.findOne({_id : req.params.id}).populate('activitys').exec(function(err, activity) {
    if (err)
      res.json(event.new(err).error().log('error').toJson());
    else
      res.json(activity);
  });
}

service.query = function(req, res) {
  var dataList = controllers.processDataList(Activity, req.query);

  Activity.find(dataList.filter).
    sort(dataList.sort).
    skip(dataList.page.skip).
    limit(dataList.page.limit).
    populate('activity').
    populate('activitys').
    exec(function(err, activitys) {
      if(err)
        res.json(event.new(err).error().log('error').toJson());
      else
        res.json(activitys);
  });
}

service.validate = function(req, res, next) {
  var activity = new Activity(req.body);
  activity.validate(function(err){
    if(err)
      res.json(event.new(err).error().log('error').toJson());
    else
      next();
  });
}

service.create = function(req, res) {
  var activity = new Activity(req.body);
  activity.save(function(err, activity) {
    if(err)
      res.json(event.new(err).error().log('error').toJson());
    else
      res.json(event.new(res.__("Activity")+" "+res.__("created")).success().log('info').data(activity).toJson());
  });
}

service.update = function(req, res) {
  delete req.body._id;
  Activity.findOneAndUpdate({_id : req.params.id }, req.body, { upsert : true }, function(err, activity) {
    if(err)
      res.json(event.new(err).error().log('error').toJson());
    else
      res.json(event.new(res.__("Activity") +" "+res.__("updated")).success().log('info').data(activity).toJson());
  });
}

service.destroy = function(req, res) {  
  Activity.remove({_id : req.params.id}, function(err) {
    if(err)
      res.json(event.new(err).error().log('error').toJson());
    else
      res.json(event.new(res.__("Destroyed")).success().log('info').toJson());
  });
}

admin.dashboard = function(req, res) {
  var locale = (config.locales.indexOf(req.cookies.locale) >= 0) ? req.cookies.locale : config.defaultLocale;
  res.render('access/view/activity_dashboard', {isAuth: req.isAuthenticated(), locale: locale});
}

var ActivityController = function(di) {
  event = new di.event.new('Instance created').success().present().log('info');
  config = di.config;
  models = di.models;
  controllers = di.controllers;
  Activity = models.activity; // object/class
  this.service = service;
  this.admin = admin;
};

module.exports = exports = ActivityController;