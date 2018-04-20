var service = {}, admin = {}, models, controllers, event, config, {{ schema | capitalize }}, $i;

service.count = async (req, res) => {
  let dataList = controllers.processDataList({{ schema | capitalize }}, req.query);

  try {
    let totality = await {{ schema | capitalize }}.count();
    if(dataList.filter == null) {
      return res.json({totality: totality, filtered: 0});
    }
    let filtered = await {{ schema | capitalize }}.count(dataList.filter);
    return res.json({totality: totality, filtered: filtered});
  } catch(err) {
    return res.json(event.newError(err).toJson());
  }
}

service.get = async (req, res) => {
  try {
    let {{ schema | lower }} = await {{ schema | capitalize}}.findOne({_id : req.params.id}){%- for fieldName, field in fields %}{%- if field.ref %}.populate('{{ fieldName | lower }}'){%- endif %}{%- endfor %}.exec();
    return res.json({{ schema | lower}});
  } catch(err) {
    return res.json(event.newError(err).toJson());
  }
}

service.query = async (req, res) => {
  let dataList = { page: {}, sort: 'field -_id' };
  if(req.query.filter || req.query.sort || req.query.page)
    dataList = controllers.processDataList({{ schema | capitalize }}, req.query);

  try {
    let {{ schema | lower }}s = await {{ schema | capitalize }}.find(dataList.filter || null).
      sort(dataList.sort || null).
      skip(dataList.page.skip || null).
      limit(dataList.page.limit || null).
      populate('{{ schema | lower }}'){%- for fieldName, field in fields %}{%- if field.ref %}.
      populate('{{ fieldName | lower }}'){%- endif %}{%- endfor %}.
      exec();
    return res.json({{ schema | lower }}s);
  } catch(err) {
    return res.json(event.newError(err).toJson());
  }
}

service.validate = (req, res, next) => {
  let {{ schema | lower }} = new {{ schema | capitalize }}(req.body);
  {{ schema | lower }}.validate(function(err){
    if(err)
      return res.json(event.newError(err).toJson());
    else
      return next();
  });
}

service.create = async (req, res) => {
  try {
    let {{ schema | lower }} = new {{ schema | capitalize }}(req.body);
    {{ schema | lower }} = await {{ schema | lower }}.save();
    return res.json(event.newSuccess(res.__("{{ schema }}")+" "+res.__("created")).data({{ schema | lower }}).toJson());
  } catch(err) {
    return res.json(event.newError(err).toJson());
  }
}

service.update = async (req, res) => {
  delete req.body._id;
  try {
    let {{ schema | lower }} = await {{ schema | capitalize }}.findOneAndUpdate({_id : req.params.id }, req.body, { upsert : true });
    return res.json(event.newSuccess(res.__("{{ schema }}")+" "+res.__("updated")).data({{ schema | lower }}).toJson());
  } catch(err) {
    return res.json(event.newError(err).toJson());
  }
}

service.destroy = async (req, res) => {  
  try {
    await {{ schema | capitalize }}.remove({_id : req.params.id});
    return res.json(event.newSuccess(res.__("Destroyed")).toJson());
  } catch(err) {
    return res.json(event.newError(err).toJson());
  }
}

admin.dashboard = (req, res) => {
  let locale = (config.locales.indexOf(req.cookies.locale) >= 0) ? req.cookies.locale : config.defaultLocale;
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