/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Eun Dong Kim    Student ID: 144692209   Date: Feb 02, 2022
*
*  Online (Heroku) URL: ________________________________________________________
*
*  GitHub Repository URL: ______________________________________________________
*
********************************************************************************/ 

var express = require("express");
var blogService = require("./blog-service.js");
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
});

// setup another route to listen on /blog
app.get("/blog", function(req,res){
    //TODO: get all posts who have published==true
    blogService.getPublishedPosts().then((data)=>{
        res.json(data)
    }).catch((err)=>{
        console.log(err)
        res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
    })
});

// setup another route to listen on /posts
app.get("/posts", function(req,res){
    //TODO: get all posts within the posts.json file
    blogService.getAllPosts().then((data)=>{
        res.json(data)
    }).catch((err)=>{
        console.log(err)
        res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
    })
});

// setup another route to listen on /categories
app.get("/categories", function(req,res){
    //TODO: get all posts within the categories.json file
    blogService.getCategories().then((data)=>{
        res.json(data)
    }).catch((err)=>{
        console.log(err)
        res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
    })
});

// setup another route to display 404
app.use(function(req,res){
    res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

// setup http server to listen on HTTP_PORT
blogService.initialize().then(()=>{
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err)=>{
    console.log(err);
    res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
})
