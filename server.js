/*********************************************************************************
*  WEB322 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Eun Dong Kim    Student ID: 144692209   Date: Mar 22, 2022
*
*  Online (Heroku) URL: https://aqueous-garden-50159.herokuapp.com/
*
*  GitHub Repository URL: https://github.com/ekim122/web322-app
*
********************************************************************************/ 

var express = require("express");
var blogService = require("./blog-service.js");
var app = express();
var path = require("path");
const env = require("dotenv")
var authData = require("./auth-service.js");
var clientSessions = require("client-sessions")
env.config()
const HTTP_PORT = process.env.PORT
const onHttpStart = () => console.log(`Express http server listening on: ${HTTP_PORT}`)
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
app.use(express.static('public'));
const stripJs = require('strip-js');
app.use(express.urlencoded({extended: true}));
app.use(clientSessions({
    cookieName: "session",
    secret: "web322-app_assign6",
    duration: 2*60*1000,
    activeDuration: 1000*60
}))
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});
function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    }
    else{
        next();
    }
}  

const exphbs = require("express-handlebars");
app.engine('.hbs', exphbs.engine({ extname: '.hbs',
                                     helpers:{
                                            navLink: function(url, options){
                                            return '<li' + 
                                                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                                                '><a href="' + url + '">' + options.fn(this) + '</a></li>';},

                                            equal: function (lvalue, rvalue, options) {
                                                if (arguments.length < 3)
                                                    throw new Error("Handlebars Helper equal needs 2 parameters");
                                                if (lvalue != rvalue) {
                                                    return options.inverse(this);
                                                } else {
                                                    return options.fn(this);}},

                                             safeHTML: function(context){
                                                 return stripJs(context);},

                                            formatDate: function(dateObj){
                                            let year = dateObj.getFullYear();
                                            let month = (dateObj.getMonth() + 1).toString();
                                            let day = dateObj.getDate().toString();
                                            return `${year}-${month.padStart(2, '0')}-${day.padStart(2,'0')}`;}                
                                }}));
app.set('view engine', '.hbs');
// ====================================================================



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
});
// ====================================================================



// middleware function to fix issue that "AddPost" menu item is no longer highlited when change routes
app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
});
// ====================================================================



// Cloudinary image Upload function with /posts/add route
const upload = multer();
app.post("/posts/add", ensureLogin, upload.single("featureImage"), function (req, res) {

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
    
        blogService.addPost(req.body).then(()=>{
            res.redirect("/posts")
        }).catch((err)=>res.json({"message":err}))
    });
    
})
// ====================================================================



// setup get /login route
app.get("/login", function(req,res){
    res.render('login');
});
// ====================================================================



// setup get /register route
app.get("/register", function(req,res){
    res.render('register');
});
// ====================================================================



// setup post /register route
app.post("/register", function(req,res){
    authData.registerUser(req.body)
    .then((data)=>{
        res.render('register', {successMessage: "User created"})
    })
    .catch((err)=>{
        res.render('register', {errorMessage: err, userName: req.body.userName})
    })
});
// ====================================================================



// setup post /login route
app.post("/login", function(req,res){
    req.body.userAgent = req.get('User-Agent');
    authData.checkUser(req.body).then((user) => {
        req.session.user = {
            userName: user.userName,// authenticated user's userName
            email: user.email,// authenticated user's email
            loginHistory: user.loginHistory// authenticated user's loginHistory
        }
        res.redirect('/posts');
    })
    .catch((err)=>{
        res.render('login', {errorMessage: err, userName: req.body.userName})
    })  
});
// ====================================================================



// setup get /logout route
app.get("/logout", function(req,res){
    req.session.reset()
    res.redirect('/');
});
// ====================================================================



// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
    res.redirect('/blog');
});
// ====================================================================



// setup another route to listen on /about
app.get("/about", function(req,res){
    res.render("about")
});
// ====================================================================



// setup another route to listen on /blog
app.get('/blog', async (req, res) => {

    let viewData = {};

    try{
        let posts = [];

        if(req.query.category){
            posts = await blogService.getPublishedPostsByCategory(req.query.category);
        }else{
            posts = await blogService.getPublishedPosts();
        }

        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        let post = posts[0]; 

        viewData.posts = posts;
        viewData.post = post;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        let categories = await blogService.getCategories();
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    res.render("blog", {data: viewData})
});
// ====================================================================



// setup "/post/value" route
app.get("/post/:id", ensureLogin, function (req, res){
    blogService.getPostById(req.params.id).then((data)=>{
        res.json(data)
    }).catch((err)=>{
        console.log(err)
    })
})
// ====================================================================



// setup "/blog/value" route
app.get('/blog/:id', async (req, res) => {

    let viewData = {};

    try{
        let posts = [];

        if(req.query.category){
            posts = await blogService.getPublishedPostsByCategory(req.query.category);
        }else{
            posts = await blogService.getPublishedPosts();
        }

        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

        viewData.posts = posts;

    }catch(err){
        viewData.message = "no results";
    }

    try{
        viewData.post = await blogService.getPostById(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }

    try{
        let categories = await blogService.getCategories();
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    res.render("blog", {data: viewData})
});
// ====================================================================



// setup another route to listen on /posts
app.get("/posts", ensureLogin, function(req,res){
    if (req.query.category){
        blogService.getPostsByCategory(req.query.category).then((data)=>{
            if (data.length > 0){
                res.render("posts", {posts: data})
            }else{
                res.render("posts",{ message: "no results" });
            }
        }).catch((err)=>{
            res.render("posts", {message: "no results"});
            console.log(err)
        })
    }
    else if(req.query.minDate){
        blogService.getPostsByMinDate(req.query.minDate).then((data)=>{
            if (data.length > 0){
                res.render("posts", {posts: data})
            }else{
                res.render("posts",{ message: "no results" });
            }
        }).catch((err)=>{
            res.render("posts", {message: "no results"});
            console.log(err)
        })
    }
    else{

        blogService.getAllPosts().then((data)=>{
            if (data.length > 0){
                res.render("posts", {posts: data})
            }else{
                res.render("posts",{ message: "no results" });
            }
        }).catch((err)=>{
            res.render("posts", {message: "no results"});
            console.log(err)
        })
    }
});
// ====================================================================



// setup another route to listen on /categories
app.get("/categories", ensureLogin, function(req,res){
    blogService.getCategories().then((data)=>{
        if (data.length > 0){
            res.render("categories", {categories: data});
        }else{
            res.render("categories", {message: "no results"});
        }
    }).catch(()=>{
        res.render("categories", {message: "no results"});
    })
});
// ====================================================================



// setup another route to display addPost
app.get("/posts/add", ensureLogin, function(req,res){
    blogService.getCategories().then((data)=>{
        res.render("addPost", {categories: data});
    }).catch(()=>{
        res.render("addPost", {categories: []});
    })
});
// ====================================================================



// setup get route for /categories/add
app.get("/categories/add", ensureLogin, function(req,res){
    res.render("addCategory")
});
// ====================================================================



// setup post route for /categories/add
app.post("/categories/add", ensureLogin, function(req,res){
    blogService.addCategory(req.body).then(()=>{
        res.redirect("/categories")
    })
});
// ====================================================================



// setup get route for /categories/delete/:id
app.get("/categories/delete/:id", ensureLogin, function(req,res){
    blogService.deleteCategoryById(req.params.id).then((data)=>{
        res.redirect("/categories")
    }).catch(()=>{
        res.status(500).send("Unable to Remove Category / Category not found")
    })
});
// ====================================================================



// setup get route for /posts/delete/:id
app.get("/posts/delete/:id", ensureLogin, function(req,res){
    blogService.deletePostById(req.params.id).then((data)=>{
        res.redirect("/posts")
    }).catch(()=>{
        res.status(500).send("Unable to Remove Post / Post not found")
    })
});
// ====================================================================



// setup another route to display 404
app.use(function(req,res){
    res.render("404")
});
// ====================================================================



// setup http server to listen on HTTP_PORT
// blogService.initialize().then(()=>{
//     app.listen(HTTP_PORT, onHttpStart);
// }).catch((err)=>{
//     console.log(err);
//     res.status(500).send('Internal Server Error')
// })
blogService.initialize()
.then(authData.initialize)
.then(function(){
    app.listen(HTTP_PORT, function(){
        console.log("app listening on: " + HTTP_PORT)
    });
}).catch(function(err){
    console.log("unable to start server: " + err);
});
// ====================================================================