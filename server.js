/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Eun Dong Kim    Student ID: 144692209   Date: Feb 16, 2022
*
*  Online (Heroku) URL: https://protected-fortress-26963.herokuapp.com/
*
*  GitHub Repository URL: https://github.com/ekim122/web322-app
*
********************************************************************************/ 

var express = require("express");
var blogService = require("./blog-service.js");
var app = express();
var path = require("path");
const env = require("dotenv")
env.config()
const HTTP_PORT = process.env.PORT
const onHttpStart = () => console.log(`Express http server listening on: ${HTTP_PORT}`)
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
app.use(express.static('public'));
// ====================================================================



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
});
// ====================================================================



//Image Upload
const upload = multer(); // no { storage: storage } since we are not using disk storage
app.post("/posts/add", upload.single("featureImage"), function (req, res) {

    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
                }
            );
    
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };
    
    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
    }
    
    upload(req).then((uploaded)=>{
        req.body.featureImage = uploaded.url;
    
        // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
        blogService.addPost(req.body).then(()=>{
            res.redirect("/posts")
        })
    });
    
})
// ====================================================================



// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
    res.redirect('/about');
});
// ====================================================================



// setup another route to listen on /about
app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
});
// ====================================================================



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
// ====================================================================



// setup "/post/value" route
app.get("/post/:id", function (req, res){
    blogService.getPostById(req.params.id).then((data)=>{
        res.json(data)
    }).catch((err)=>{
        console.log(err)
        res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
    })
})
// ====================================================================



// setup another route to listen on /posts
app.get("/posts", function(req,res){
    if (req.query.category){
        blogService.getPostsByCategory(req.query.category).then((data)=>{
            res.json(data)
        }).catch((err)=>{
            console.log(err)
            res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
        })
    }
    else if(req.query.minDate){
        blogService.getPostsByMinDate(req.query.minDate).then((data)=>{
            res.json(data)
        }).catch((err)=>{
            console.log(err)
            res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
        })
    }
    else{
        //TODO: get all posts within the posts.json file
        blogService.getAllPosts().then((data)=>{
            res.json(data)
        }).catch((err)=>{
            console.log(err)
            res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
        })
    }
});
// ====================================================================



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
// ====================================================================



// setup another route to display addPost
app.get("/posts/add", function(req,res){
    res.sendFile(path.join(__dirname, "/views/addPost.html"));
});
// ====================================================================



// setup another route to display 404
app.use(function(req,res){
    res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});
// ====================================================================



// setup http server to listen on HTTP_PORT
blogService.initialize().then(()=>{
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err)=>{
    console.log(err);
    res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
})
// ====================================================================