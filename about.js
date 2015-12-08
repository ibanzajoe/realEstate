var mongoose = require('mongoose'),
    express = require('express'),
    bout = require('./schemas/aboutSchema'),
    Lists = require('./schemas/listScheme'),
    service = require('./schemas/service'),
    test = require('./schemas/test'),
    contact = require('./schemas/contact'),
  //  disc = require('./schemas/disclaimer'),
    bodyParser = require('body-parser'),
    request = require('request'),
    cheerio = require('cheerio'),
    EventEmitter = require('events').EventEmitter,
    control = new EventEmitter(),
    secret = require('./config/secret')
    session = require('express-session');

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
function testSession(req, res, next){
    if(req.session.login==true){
    next();
    } else {
        res.redirect('/');
    }
}

var server = app.listen(3000, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('example app listening at http://%s:%s', host, port);
});
mongoose.connect('mongodb://localhost/test');

app.get('/', function(req, res){
    res.render('login');
    console.log(secret);
});
app.post('/login', function(req, res){
    console.log(req.body.username);
    console.log(req.body.password);
    console.log(secret.user.username);
    console.log(secret.user.password);
    if((secret.user.username == req.body.username) && (secret.user.password == req.body.password)){
        req.session.login = true;
        console.log(req.session.login);
        res.render('loginScreen', {
            username: req.body.username,
            password: req.body.password
        })

    } else{
        res.send('your username and/or password is incorrect')
    }
});

app.get('/addInfo', testSession, function(req, res) {
    if(req.session.login==true){
        res.render('addInfo');
    } else {
        console.log('it did not work, fix it');
    }

    });
app.post('/insertAgent', testSession, function(req, res){
    var info = new bout({
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
    bout.save(function(err,bout){
        res.send(bout);
    })
});

app.get('/addList', testSession, function(req, res){
    res.render('listing');
});
app.post('/insert', testSession, function(req, res){
    var nList = new Lists({
        url: req.body.url,
        title: req.body.title,
        price: req.body.price,
        description: req.body.descript                    //description of listing
    });
    nList.save(function (err, nList) {
        if (err) console.error(err);
        res.redirect('/database');
    })
});

app.get('/addService', testSession, function (req, res) {
    res.render('service');
});
app.post('/insertService', testSession, function (req, res) {
    var serv = new service({
        url: req.body.url,
        descript: req.body.descript
    })
    serv.save(function (err, serv) {
        if (err) console.error(err);
        res.send(serv);
    })
});

app.get('/addTest', testSession, function (req, res) {
    res.render('testimony');
});
app.post('/insertTesti', testSession, function (req, res) {
    var testz = new test({
        url: req.body.url,
        testimony: req.body.testimony,
        name: req.body.name
    })
    testz.save(function (err, test) {
        if (err) console.error(err);
        res.send(testz);
    })
});

app.get('/seeList', testSession, function(req, res) {
//    req.session.tumadre = req.session.tumadre? req.session.tumadre+1:1;
//    console.log(req.session.tumadre);
    bout.find({name: 'Anna Lee'}, function (err, x) {
        Lists.find(function (err, y) {
            service.find(function (err, z) {
                test.find(function (err, t) {
                    res.render('about', {
                        bout: x,
                        Lists: y,
                        service: z,
                        test: t
                    })
                })
            });
        });
    });
});
app.get('/logOut', testSession, function(req, res){
    req.session.login=false;
    res.send('you are logged out');
    console.log(req.session.login);
})


app.get('/findAgent', testSession, function(req,res){
    res.render('findAgent');
});
app.post('/updateAgent', testSession, function(req,res){
    console.log(req.body.name);
    bout.findOne({name:req.body.name}, function(err, name){
    console.log(bout);
    })
})


app.get('/addContact', testSession, function (req, res) {
    res.render('contact');
});
app.post('/insertContact', testSession, function (req, res) {
    var cont = new contact({
        facebook: req.body.facebook,
        twitter: req.body.twitter,
        skype: req.body.skype
    })
    cont.save(function (err, cont) {
        res.send(cont);
    });
});
app.get('/createAgent', testSession, function(req, res) {
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
app.get('/agentdb', testSession, function (req, res) {
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
app.get('/database', testSession, function(req, res){
    Lists.find(function(err, lists) {
        res.send(lists);
    })
});