var service = {}, admin = {}, models, controllers, event, config, {{ schema | capitalize }}, $i;

service.count = function(req, res) {
  var dataList = controllers.processDataList({{ schema | capitalize }}, req.query);

  {{ schema | capitalize }}.count({}, function(err, totality) {
    if(err) {
      res.json(event.newError(err).toJson());
      return;
    } 

    if(dataList.filter == null) {
      res.json({totality: totality, filtered: 0});
      return;
    }

    {{ schema | capitalize }}.count(dataList.filter, function(err, filtered) {
      if(err)
        res.json(event.newError(err).toJson());
      else
        res.json({totality: totality, filtered: filtered});
    });
  });
}

service.get = function(req, res) {
    {{ schema | capitalize}}.findOne({_id : req.params.id}){%- for fieldName, field in fields %}{%- if field.ref %}.populate('{{ fieldName | lower }}'){%- endif %}{%- endfor %}.exec(function(err, {{ schema | lower }}) {
    if (err)
      res.json(event.newError(err).toJson());
    else
      res.json({{ schema | lower}});
  });
}

service.query = function(req, res) {
  var dataList = { page: {}, sort: 'field -_id' };
  if(req.query.filter || req.query.sort || req.query.page)
    dataList = controllers.processDataList({{ schema | capitalize }}, req.query);

  {{ schema | capitalize }}.find(dataList.filter || null).
    sort(dataList.sort || null).
    skip(dataList.page.skip || null).
    limit(dataList.page.limit || null).
    populate('{{ schema | lower }}'){%- for fieldName, field in fields %}{%- if field.ref %}.
    populate('{{ fieldName | lower }}'){%- endif %}{%- endfor %}.
    exec(function(err, {{ schema | lower }}s) {
      if(err)
        res.json(event.newError(err).toJson());
      else
        res.json({{ schema | lower }}s);
  });
}

service.validate = function(req, res, next) {
  var {{ schema | lower }} = new {{ schema | capitalize }}(req.body);
  {{ schema | lower }}.validate(function(err){
    if(err)
      res.json(event.newError(err).toJson());
    else
      next();
  });
}

service.create = function(req, res) {
  var {{ schema | lower }} = new {{ schema | capitalize }}(req.body);
  {{ schema | lower }}.save(function(err, {{ schema | lower }}) {
    if(err)
      res.json(event.newError(err).toJson());
    else
      res.json(event.newSuccess(res.__("{{ schema }}")+" "+res.__("created")).data({{ schema | lower }}).toJson());
  });
}

service.update = function(req, res) {
  delete req.body._id;
  {{ schema | capitalize }}.findOneAndUpdate({_id : req.params.id }, req.body, { upsert : true }, function(err, {{ schema | lower }}) {
    if(err)
      res.json(event.newError(err).toJson());
    else
      res.json(event.newSuccess(res.__("{{ schema }}")+" "+res.__("updated")).data({{ schema | lower }}).toJson());
  });
}

service.destroy = function(req, res) {  
  {{ schema | capitalize }}.remove({_id : req.params.id}, function(err) {
    if(err)
      res.json(event.newError(err).toJson());
    else
      res.json(event.newSuccess(res.__("Destroyed")).toJson());
  });
}

admin.dashboard = function(req, res) {
  var locale = (config.locales.indexOf(req.cookies.locale) >= 0) ? req.cookies.locale : config.defaultLocale;
  res.render('{{ bundle | lower }}/view/{{ schema | lower }}_dashboard', { isAuth: req.isAuthenticated(), locale: locale, user: req.user});
}

var {{ schema | capitalize }}Controller = function(di) {
  $i = di;
  event = new $i.event.newSuccess('Instance created');
  config = $i.config;
  models = $i.models;
  controllers = $i.controllers;
  {{ schema | capitalize }} = models.{{ schema | lower }}; // object/class
  this.service = service;
  this.admin = admin;
};

module.exports = exports = {{ schema | capitalize }}Controller;