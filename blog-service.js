const fs = require("fs");

var posts = [];
var categories = [];

module.exports.initialize = function(){
    return new Promise (function(resolve,reject){
        try{
            fs.readFile('./data/posts.json', 'utf8', (err, data) => {
                if (err) throw err;
                posts = JSON.parse(data);
                //console.log(data);
            });
    
            fs.readFile('./data/categories.json', 'utf8', (err, data) => {
                if (err) throw err;
                categories = JSON.parse(data);
                //console.log(data);
            });
            console.log("Initialized")
            resolve("Initialization Successful")
        }catch{
            console.log("Failed");
            reject("Failed Initialization")
        }
    })
};

module.exports.getAllPosts = function(){
    return new Promise (function(resolve,reject){
        if(posts.length === 0){
            reject("No Results Returned");
        }
        resolve(posts);
    })
};

module.exports.getPublishedPosts=function(){ //need to edit
    return new Promise (function(resolve,reject){
        if(posts.length === 0){
            reject("No Results Returned");
        }else{
            for (var i = 0; i < posts.length; i++){
                if (posts[i].published == true){
                    resolve(posts[i]);
                }
            }
        }
        //resolve(posts);
    })
};

module.exports.getCategories = function(){
    return new Promise (function(resolve,reject){
        if(categories.length === 0){
            reject("No Results Returned");
        }
        resolve(categories);
    })
};