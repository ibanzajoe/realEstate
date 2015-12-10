var mongoose = require('mongoose'),
  express = require('express'),
  Agent = require('./schemas/aboutSchema'),
  List = require('./schemas/listScheme'),
  Service = require('./schemas/service'),
  Tests = require('./schemas/test'),
  contact = require('./schemas/contact'),
//  disc = require('./schemas/disclaimer'),
  bodyParser = require('body-parser'),
  request = require('request'),
  EventEmitter = require('events').EventEmitter,
  control = new EventEmitter(),
  secret = require('./config/secret'),
  db_settings = require('./config/db'),
  session = require('express-session'),
  _ = require('lodash');

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
});
var app = express();
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(session({
  secret: 'keyboard cat',
  cookie: {}
}));

function loggedIn(req, res, next){
  if(req.session.login==true){
    next();
  } else {
    res.redirect('/login');
  }
}

var server = app.listen(3333, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('example app listening at http://%s:%s', host, port);
});
mongoose.connect(db_settings.db);

app.get('/', function(req, res){
  Agent.findOne(function (err, agent) {
    List.find(function (err, y) {
      Service.find(function (err, z) {
        Tests.find(function (err, t) {
          console.log(y);
          res.render('about', {
            agent: agent,
            Lists: y,
            service: z,
            test: t
          })
        })
      });
    });
  });
});


app.get('/admin', loggedIn, function(req,res){
  res.render('adminHome');
})


app.get('/login', function(req,res){
  res.render('login')
})


app.post('/login', function(req, res){
  if((secret.user.username == req.body.username) && (secret.user.password == req.body.password)){
    req.session.login = true;
    res.redirect('/admin');

  } else{
    res.send('your username and/or password is incorrect')
  }
});


app.get('/agent', loggedIn, function(req, res) {
  Agent.findOne(function(err, agent){
    res.render('agent', {
      data: agent
    });
  });
});

app.post('/insertAgent', loggedIn, function(req, res){
  var id = req.body._id;

  Agent.findOne({_id: id}, function(err, agent){
    if(agent){
      agent.pURL=req.body.pURL;
      agent.name=req.body.name;
      agent.title=req.body.title;
      agent.phone=req.body.phone;
      agent.fax=req.body.fax;
      agent.email=req.body.email;
      agent.address=req.body.address;
      agent.facebook=req.body.facebook;
      agent.twitter=req.body.twitter;
      agent.skype=req.body.skype;
      agent.disclaimer=req.body.disclaimer;
      agent.unsubscribe=req.body.unsubscribe;
      agent.copyright=req.body.copyright;
      agent.save(function(err, saved){
        if(err) console.log(err)

        res.redirect('/');
      });
    } else{
      var agent = new Agent({
        pURL: req.body.pURL,
        name: req.body.name,
        title: req.body.title,
        phone: req.body.phone,
        fax: req.body.fax,
        email: req.body.email,
        address: req.body.address,
        facebook: req.body.face,
        twitter: req.body.twitter,
        skype: req.body.skype,
        disclaimer: req.body.disclaimer,
        unsubscribe: req.body.unsubscribe,
        copyright: req.body.copyright
      });

      agent.save(function(err, saved){
        if(err) console.log(err)
        res.redirect('/')
      })
    }
  })
});

app.get('/listings', loggedIn, function(req, res){
  var query = req.query,
    filters = {}

  if(query.title){
    filters.title = query.title
  }

  if(query.description){
    filters.description = query.description
  }

  if(query.price){
    filters.price = query.price
  }

  List.find(filters, function(err, lists) {
    res.render('listings',{
      filters: filters,
      Lists: lists
    });
  })
});

app.get('/listing/new', function(req,res){
  var id = req.params.id

  res.render('list',{
    list: {}
  })
})

app.get('/listing/edit/:id', function(req,res){
  var id = req.params.id

  List.findOne({_id: id}, function(err, list){
    res.render('list', {
      list: list
    })
  })
})

app.post('/listing/save', function(req,res){
  var body = req.body,
    id = body._id

  if(id){
    List.findOne({_id: id}, function(err, list){
      if(err) console.log(err)

      if(list){
        //update current list
        var updated = _.assign(list, body)
        updated.save( function(err, saved){
          if(err) console.log(err)

          res.redirect('/listings')
        })
      }else{
        console.log('bad id')
        res.resnd('tu madre')
      }
    })
  }else{
    //create new
    delete body._id
    var list = new List(body)
    list.save(function(err,saved){
      if(err) console.log(err)
      console.log('saved')
      res.redirect('/listings')
    })
  }
})


app.get('/addList', loggedIn, function(req, res){
  res.render('listing');
});
app.post('/insert', loggedIn, function(req, res){
  var nList = new Lists({
    url: req.body.url,
    title: req.body.title,
    price: req.body.price,
    description: req.body.descript                    //description of listing
  });
  nList.save(function (err, cb) {
    if (err) console.error(err);
    res.redirect('/database');
  })
});

app.get('/service/new', loggedIn, function (req, res) {
  res.render('service');
});
app.post('/service/insert', loggedIn, function (req, res) {
  var serv = new Service({
    primary_photo: req.body.primary_photo,
    service: req.body.service
  })
  serv.save(function (err, serv) {
    if (err) console.error(err);
    res.send(serv);
  })
});
app.get('/service', function(req, res){
  Service.find(function(err, service){
    console.log(service);
    res.render('viewService', {
      Service: service
    })
  })
})
app.get('/service/edit/:id', function(req,res){
  var id = req.params.id

  Service.findOne({_id: id}, function(err, service){
    res.render('service2', {
      Service: service
    })
  })
})
app.post('/service/save', function(req,res){
  var body = req.body,
    id = body._id

  if(id){
    Service.findOne({_id: id}, function(err, service){
      if(err) console.log(err)

      if(service){
        //update current list
        var updated = _.assign(service, body)
        updated.save( function(err, saved){
          if(err) console.log(err)

          res.redirect('/service')
        })
      }else{
        console.log('bad id')
        res.resnd('tu madre')
      }
    })
  }else{
    //create new
    delete body._id
    var service = new Service(body)
    service.save(function(err,saved){
      if(err) console.log(err)
      console.log('saved')
      res.redirect('/service')
    })
  }
})

app.get('/testimony/new', loggedIn, function (req, res) {
  res.render('testimony');
});
app.post('/testimony/insert', loggedIn, function (req, res) {
  console.log(req.body.primary_photo);
  var testz = new Tests({
    primary_photo: req.body.primary_photo,
    test: req.body.test,
    name: req.body.name
  })
  testz.save(function (err, test) {
    if (err) console.error(err);
    res.redirect('/admin')
  })
});

app.get('/viewTest', function(req, res){
  Tests.find(function(err, test) {
    console.log(test);
    res.render('viewTest',{
      Tests: test
    });
  })
})

app.get('/testimony/edit/:id', function(req,res){
  var id = req.params.id
  console.log(id);
  Tests.findOne({_id: id}, function(err, test){
    console.log(test);
    res.render('testimony2', {
      Tests: test
    })
  })
})

app.post('/testimony/save/', function(req,res){
  var body = req.body,
    id = body._id

  if(id){
    Tests.findOne({_id: id}, function(err, test){
      if(err) console.log(err)

      if(test){
        //update current list
        var updated = _.assign(test, body)
        updated.save( function(err, saved){
          if(err) console.log(err)

          res.redirect('/viewTest')
        })
      }else{
        console.log('bad id')
        res.resend('tu madre')
      }
    })
  }else{
    //create new
    delete body._id
    var list = new List(body)
    list.save(function(err,saved){
      if(err) console.log(err)
      console.log('saved')
      res.redirect('/listings')
    })
  }
})


app.get('/seeList', loggedIn, function(req, res) {
//    req.session.tumadre = req.session.tumadre? req.session.tumadre+1:1;
//    console.log(req.session.tumadre);
  Agent.findOne(function (err, agent) {
    List.find(function (err, list) {
      Service.find(function (err, service) {
        Tests.find(function (err, test) {
          res.render('about', {
            agent: agent,
            Lists: list,
            service: service,
            test: test
          })
        })
      });
    });
  });
});
app.get('/logOut', loggedIn, function(req, res){
  req.session.login=false;
  res.send('you are logged out');
  console.log(req.session.login);
})


app.get('/findAgent', loggedIn, function(req,res){
  res.render('findAgent');
});
app.post('/updateAgent', loggedIn, function(req,res){
  console.log(req.body.name);
  bout.findOne({name:req.body.name}, function(err, name){
    console.log(bout);
  })
})


app.get('/addContact', loggedIn, function (req, res) {
  res.render('contact');
});
app.post('/insertContact', loggedIn, function (req, res) {
  var cont = new contact({
    facebook: req.body.facebook,
    twitter: req.body.twitter,
    skype: req.body.skype
  })
  cont.save(function (err, cont) {
    res.send(cont);
  });
});
app.get('/createAgent', loggedIn, function(req, res) {
  var nbout = new bout({
    pURL: 'xxxx',
    name: 'Anna Lee',
    title: 'Real Estate Agent',
    phone: '818-497-4098',
    fax: '818-797-9999',
    email: 'banzajoe@gmail.com',
    address: 'Address: 4578 Marmora Road, Glasgow D04 89GR',
    disclaimer: "You're receiving this email because you signed up for «David Brown» or attended one of our events.",
    unsubscribe: "You can unsubscribe from this email or change your email notifications.",
    copyright: "David Brown © 2015. Privacy Policy"
  });
  nbout.save(function (err, bout) {
    if (err) return console.error(err);
    res.redirect('/agentdb');
  });
});
app.get('/agentdb', loggedIn, function (req, res) {
  bout.findOne({name: 'Anna Lee'}, function (err, bout) {
    if (err) return console.error(err);
    console.log(bout.name);
    res.render('about', {
      "pURL": bout.pURL,
      "name": bout.name,
      "title": bout.title,
      "phone": bout.phone,
      "fax": bout.fax,
      "email": bout.email
    });
  });

});

app.post('/updateData', loggedIn, function(req,res) {
  if (req.body.pURL) {
    Lists.findOne({url: req.body.pURL}, function (err, cb) {
      console.log("URL: ", cb);
      res.render('editListing', {
        list: cb
      });
    });
  } else {
    if (req.body.title) {
      Lists.findOne({title: req.body.title}, function (err, cb) {
        console.log("title: ", cb);
        res.render('editListing', {
          list: cb
        });
      })
    }
    else {
      if (req.body.description) {
        Lists.findOne({description: req.body.description}, function (err, cb) {
          console.log("desc: ", cb);
          res.render('editListing', {
            list: cb
          });
        })
      }
      else {
        if (req.body.photo) {
          Lists.findOne({photo: req.body.photo}, function (err, cb) {
            console.log("photo: ", cb);
            res.render('editListing', {
              list: cb
            });
          })
        }
        else {
          if (req.body.price) {
            Lists.findOne({price: req.body.price}, function (err, cb) {
              console.log("price: ", cb);
              res.render('editListing', {
                list: cb
              });
            })
          }
        }
      }
    }
  }
});

app.post('/insertNewData', loggedIn, function(req,res){
  var nList = new Lists({
    url: req.body.url,
    title: req.body.title,
    price: req.body.price,
    description: req.body.descript,
    photo: req.body.photo
  });
  nList.save(function (err, cb) {
    if (err) console.error(err);
    res.redirect('/seeList');
  })
})

app.get('/test', function(req, res){
  res.render('test');
})