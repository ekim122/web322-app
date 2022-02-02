var express = require("express");
var blog = require("./blog-service.js");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
    res.redirect('/about');
});

var path = require("path");

// setup another route to listen on /about
app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
    //res.sendFile(app.join(__dirname, "/views/about.html"));
});

// setup another route to listen on /blog
app.get("/blog", function(req,res){
    //res.send(blog.join(__filename,"blog-service.js"));
    res.send("TODO: get all posts who have published==true");
});

// setup another route to listen on /posts
app.get("/posts", function(req,res){
    res.send("TODO: get all posts within the posts.json file");
});

// setup another route to listen on /categories
app.get("/categories", function(req,res){
    res.send("TODO: get all posts within the categories.json file");
});

// setup another route to display 404
app.use(function(req,res){
    res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);