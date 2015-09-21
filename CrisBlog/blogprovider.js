var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

blogProvider = function(host, port) {
  this.db= new Db('node-mongo-blog', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


blogProvider.prototype.getCollection= function(callback) {
  this.db.collection('blogs', function(error, blog_collection) {
    if( error ) callback(error);
    else callback(null, blog_collection);
  });
};

//find all blogs
blogProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, blog_collection) {
      if( error ) callback(error)
      else {
        blog_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//find an blog by ID
blogProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, blog_collection) {
      if( error ) callback(error)
      else {
        blog_collection.findOne({_id: blog_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};


//save new blog
blogProvider.prototype.save = function(blogs, callback) {
    this.getCollection(function(error, blog_collection) {
      if( error ) callback(error)
      else {
        if( typeof(blogs.length)=="undefined")
          blogs = [blogs];

        for( var i =0;i< blogs.length;i++ ) {
          blog = blogs[i];
          blog.created_at = new Date();
        }

        blog_collection.insert(blogs, function() {
          callback(null, blogs);
        });
      }
    });
};

// update an blog
blogProvider.prototype.update = function(blogId, blogs, callback) {
    this.getCollection(function(error, blog_collection) {
      if( error ) callback(error);
      else {
        blog_collection.update(
					{_id: blog_collection.db.bson_serializer.ObjectID.createFromHexString(blogId)},
					blogs,
					function(error, blogs) {
						if(error) callback(error);
						else callback(null, blogs)       
					});
      }
    });
};

//delete blog
blogProvider.prototype.delete = function(blogId, callback) {
	this.getCollection(function(error, blog_collection) {
		if(error) callback(error);
		else {
			blog_collection.remove(
				{_id: blog_collection.db.bson_serializer.ObjectID.createFromHexString(blogId)},
				function(error, blog){
					if(error) callback(error);
					else callback(null, blog)
				});
			}
	});
};

exports.blogProvider = blogProvider;