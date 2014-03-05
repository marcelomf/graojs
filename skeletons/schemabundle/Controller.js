// Glocal Scope :)
var models, controllers, event, {{ schema | capitalize }};

var service = {

  count: function(req, res) {
    var dataList = controllers.processDataList({{ schema | capitalize }}, req.query);

    {{ schema | capitalize }}.count({}, function(err, totality) {
      if(err) {
        res.json(event.new(err).error().log('error').json());
        return;
      } 

      if(dataList.filter == null) {
          res.json({totality: totality, filtered: 0});
          return;
      }

      {{ schema | capitalize }}.count(dataList.filter, function(err, filtered) {
        if(err)
          res.json(event.new(err).error().log('error').json());
        else
          res.json({totality: totality, filtered: filtered});
      });
    });
  },

  get : function(req, res) {
      {{ schema | capitalize }}.findOne({_id : req.params.id}){%- for fieldName, field in fields %}{%- if field.ref %}.populate('{{ fieldName | lower }}'){%- endif %}{%- endfor %}.exec(function(err, {{ schema | lower }}) {
      if (err)
        res.json(event.new(err).error().log('error').json());
      else
        res.json({{ schema | lower}});
    });
  },

  query : function(req, res) {
    var dataList = controllers.processDataList({{ schema | capitalize }}, req.query);

    {{ schema | capitalize }}.find(dataList.filter).
      sort(dataList.sort).
      skip(dataList.page.skip).
      limit(dataList.page.limit).
      populate('{{ schema | lower }}'){%- for fieldName, field in fields %}{%- if field.ref %}.
      populate('{{ fieldName | lower }}'){%- endif %}{%- endfor %}.
      exec(function(err, {{ schema | lower }}s) {
        if(err)
          res.json(event.new(err).error().log('error').json());
        else
          res.json({{ schema | lower }}s);
    });
  },

  validate : function(req, res, next) {
    var {{ schema | lower }} = new {{ schema | capitalize }}(req.body);
    {{ schema | lower }}.validate(function(err){
      if(err)
        res.json(event.new(err).error().log('error').json());
      else
        next();
    });
  },

  create : function(req, res) {
    var {{ schema | lower }} = new {{ schema | capitalize }}(req.body);
    {{ schema | lower }}.save(function(err, {{ schema | lower }}) {
      if(err)
        res.json(event.new(err).error().log('error').json());
      else
        res.json(event.new("{{ schema | capitalize }} created").success().log('info').data({{ schema | lower }}).json());
    });
  },

  update : function(req, res) {
    delete req.body._id;
    {{ schema | capitalize }}.findOneAndUpdate({_id : req.params.id }, req.body, { upsert : true }, function(err, {{ schema | lower }}) {
      if(err)
        res.json(event.new(err).error().log('error').json());
      else
        res.json(event.new("{{ schema | capitalize }} updated").success().log('info').data({{ schema | lower }}).json());
    });
  },

  destroy : function(req, res) {  
    {{ schema | capitalize }}.remove({_id : req.params.id}, function(err) {
      if(err)
        res.json(event.new(err).error().log('error').json());
      else
        res.json(event.new("Destroyed").success().log('info').json());
    });
  }
};

var admin = {
  dashboard : function(req, res) {
    res.render('{{ schema | lower }}/view/dashboard', {isAuth: req.isAuthenticated()});
  }
};

var {{ schema | capitalize }}Controller = function(di) {
  event = new di.event.new('Instance created').success().present().log('info');
  
  models = di.models;
  controllers = di.controllers;
  {{ schema | capitalize }} = models.{{ schema | lower }}; // object/class
  this.service = service;
  this.admin = admin;
};

module.exports = exports = {{ schema | capitalize }}Controller;