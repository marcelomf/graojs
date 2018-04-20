var service = {}, admin = {}, models, controllers, event, config, Activity, $i;

service.count = async (req, res) => {
  let dataList = controllers.processDataList(Activity, req.query);

  try {
    let totality = await Activity.count();
    if(dataList.filter == null) {
      return res.json({totality: totality, filtered: 0});
    }
    let filtered = await Activity.count(dataList.filter);
    return res.json({totality: totality, filtered: filtered});
  } catch(err) {
    return res.json(event.newError(err).toJson());
  }
}

service.get = async (req, res) => {
  try {
    let activity = Activity.findOne({_id : req.params.id}).
      populate('activitys').exec();
    return res.json(activity);
  } catch(err) {
    return res.json(event.newError(err).toJson());
  }
}

service.query = async (req, res) => {
  let dataList = { page: {}, sort: 'field -_id' };
  if(req.query.filter || req.query.sort || req.query.page)
    dataList = controllers.processDataList(Activity, req.query);

  try {
    let activitys = await Activity.find(dataList.filter || null).
      sort(dataList.sort || null).
      skip(dataList.page.skip || null).
      limit(dataList.page.limit || null).
      populate('activity').
      populate('activitys').
      exec();
    return res.json(activitys);
  } catch(err) {
    return res.json(event.newError(err).toJson());
  }
}

service.validate = (req, res, next) => {
  var activity = new Activity(req.body);
  activity.validate(function(err){
    if(err)
      return res.json(event.newError(err).toJson());
    else
      return next();
  });
}

service.create = async (req, res) => {
  try {
    let activity = await Activity.buildActivitys(req.body);
    activity = new Activity(activity);
    activity = await activity.save();
    return res.json(event.newSuccess(res.__("Activity")+" "+res.__("created")).data(activity).toJson());
  } catch(err) {
    return res.json(event.newError(err).toJson());
  }
}

service.update = async (req, res) => {
  delete req.body._id;
  try {
    let activity = await Activity.buildActivitys(req.body);
    activity = await Activity.findOneAndUpdate({_id : req.params.id }, activity, { upsert : true });
    return res.json(event.newSuccess(res.__("Activity")+" "+res.__("updated")).data(activity).toJson());
  } catch(err) {
    return res.json(event.newError(err).toJson());
  }
}

service.destroy = async (req, res) => {  
  try {
    await Activity.remove({_id : req.params.id});
    return res.json(event.newSuccess(res.__("Destroyed")).toJson());
  } catch(err) {
    return res.json(event.newError(err).toJson());
  }
}

admin.dashboard = (req, res) => {
  let locale = (config.locales.indexOf(req.cookies.locale) >= 0) ? req.cookies.locale : config.defaultLocale;
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