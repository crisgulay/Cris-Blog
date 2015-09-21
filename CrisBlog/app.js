/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , blogProvider = require('./blogprovider').blogProvider;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var blogProvider= new blogProvider('localhost', 27017);

//Routes

//index
app.get('/', function(req, res){
  blogProvider.findAll(function(error, emps){
      res.render('index', {
            title: 'Cris Blog Site',
            blogs:emps
        });
  });
});

//new blog
app.get('/blog/new', function(req, res) {
    res.render('blog_new', {
        title: 'New Blog'
    });
});

//save new blog
app.post('/blog/new', function(req, res){
    blogProvider.save({
        title: req.param('title'),
        name: req.param('name')
    }, function( error, docs) {
        res.redirect('/')
    });
});

//update an blog
app.get('/blog/:id/edit', function(req, res) {
	blogProvider.findById(req.param('_id'), function(error, blog) {
		res.render('blog_edit',
		{ 
			title: blog.title,
            name: blog.name,
			blog: blog
		});
	});
});

//save updated blog
app.post('/blog/:id/edit', function(req, res) {
	blogProvider.update(req.param('_id'),{
		title: req.param('title'),
		name: req.param('name')
	}, function(error, docs) {
		res.redirect('/')
	});
});

//delete an blog
app.post('/blog/:id/delete', function(req, res) {
	blogProvider.delete(req.param('_id'), function(error, docs) {
		res.redirect('/')
	});
});

app.listen(process.env.PORT || 3000);
