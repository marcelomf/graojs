var models, controllers, event, config, {{ schema | capitalize }};
var service = {};
var admin = {};

service.count = function(req, res) {
  var dataList = controllers.processDataList({{ schema | capitalize }}, req.query);

  {{ schema | capitalize }}.count({}, function(err, totality) {
    if(err) {
      res.json(event.new(err).error().log('error').toJson());
      return;
    } 

    if(dataList.filter == null) {
      res.json({totality: totality, filtered: 0});
      return;
    }

    {{ schema | capitalize }}.count(dataList.filter, function(err, filtered) {
      if(err)
        res.json(event.new(err).error().log('error').toJson());
      else
        res.json({totality: totality, filtered: filtered});
    });
  });
}

service.get = function(req, res) {
    {{ schema | capitalize }}.findOne({_id : req.params.id}){%- for fieldName, field in fields %}{%- if field.ref %}.populate('{{ fieldName | lower }}'){%- endif %}{%- endfor %}.exec(function(err, {{ schema | lower }}) {
    if (err)
      res.json(event.new(err).error().log('error').toJson());
    else
      res.json({{ schema | lower}});
  });
}

service.query = function(req, res) {
  var dataList = controllers.processDataList({{ schema | capitalize }}, req.query);

  {{ schema | capitalize }}.find(dataList.filter).
    sort(dataList.sort).
    skip(dataList.page.skip).
    limit(dataList.page.limit).
    populate('{{ schema | lower }}'){%- for fieldName, field in fields %}{%- if field.ref %}.
    populate('{{ fieldName | lower }}'){%- endif %}{%- endfor %}.
    exec(function(err, {{ schema | lower }}s) {
      if(err)
        res.json(event.new(err).error().log('error').toJson());
      else
        res.json({{ schema | lower }}s);
  });
}

service.validate = function(req, res, next) {
  var {{ schema | lower }} = new {{ schema | capitalize }}(req.body);
  {{ schema | lower }}.validate(function(err){
    if(err)
      res.json(event.new(err).error().log('error').toJson());
    else
      next();
  });
}

service.create = function(req, res) {
  var {{ schema | lower }} = new {{ schema | capitalize }}(req.body);
  {{ schema | lower }}.save(function(err, {{ schema | lower }}) {
    if(err)
      res.json(event.new(err).error().log('error').toJson());
    else
      res.json(event.new("{{ schema | capitalize }} created").success().log('info').data({{ schema | lower }}).toJson());
  });
}

service.update = function(req, res) {
  delete req.body._id;
  {{ schema | capitalize }}.findOneAndUpdate({_id : req.params.id }, req.body, { upsert : true }, function(err, {{ schema | lower }}) {
    if(err)
      res.json(event.new(err).error().log('error').toJson());
    else
      res.json(event.new("{{ schema | capitalize }} updated").success().log('info').data({{ schema | lower }}).toJson());
  });
}

service.destroy = function(req, res) {  
  {{ schema | capitalize }}.remove({_id : req.params.id}, function(err) {
    if(err)
      res.json(event.new(err).error().log('error').toJson());
    else
      res.json(event.new("Destroyed").success().log('info').toJson());
  });
}

admin.dashboard = function(req, res) {
  var locale = (config.locales.indexOf(req.cookies.locale) >= 0) ? req.cookies.locale : config.defaultLocale;
  res.render('{{ bundle | lower }}/view/{{ schema | lower }}_dashboard', {isAuth: req.isAuthenticated(), locale: locale});
}

var {{ schema | capitalize }}Controller = function(di) {
  event = new di.event.new('Instance created').success().present().log('info');
  config = di.config;
  models = di.models;
  controllers = di.controllers;
  {{ schema | capitalize }} = models.{{ schema | lower }}; // object/class
  this.service = service;
  this.admin = admin;
};

module.exports = exports = {{ schema | capitalize }}Controller;