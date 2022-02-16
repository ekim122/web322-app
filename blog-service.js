const fs = require("fs");

var posts = [];
var categories = [];


//initialize blog by reading/loading files
module.exports.initialize = function(){
    return new Promise (function(resolve,reject){
        fs.readFile('./data/posts.json', 'utf8', (err, data) => {
            if (err){
                console.log("Unable to read posts file")
                reject("Unable to read posts file")
            }else{
                posts = JSON.parse(data)
                console.log("Posts initialization successful")
                resolve(posts)
            }
        });

        fs.readFile('./data/categories.json', 'utf8', (err, data) => {
            if (err){
                console.log("Unable to read categories file")
                reject("Unable to read categories file")
            }else{
                categories = JSON.parse(data)
                console.log("Categories initialization successful")
                resolve(categories)
            }
        });
    })
};


// get all posts
module.exports.getAllPosts = function(){
    return new Promise (function(resolve,reject){
        if(posts.length === 0){
            reject("No results from 'getAllPosts' returned")
        }else{
            resolve(posts)
        }
    })
};


// get 'published = yes' posts only
module.exports.getPublishedPosts=function(){
    return new Promise (function(resolve,reject){
        var tempPosts = [];
        if(posts.length === 0){
            reject("No results from 'getPublishedPosts' returned")
        }else{
            for (var i = 0; i < posts.length; i++){
                if (posts[i].published == true){
                    tempPosts.push(posts[i])
                }
            }
            resolve(tempPosts)
        }
    })
};


// get all categories
module.exports.getCategories = function(){
    return new Promise (function(resolve,reject){
        if(categories.length === 0){
            reject("No results from 'getCategories' returned")
        }else{
            resolve(categories)
        }
    })
};


// add post
module.exports.addPost=function(postData){
    return new Promise (function(resolve,reject){
        if (postData.published === undefined){
            postData.published = false
        }else{
            postData.published = true
        }
        postData.id = posts.length + 1
        posts.push(postData)
        resolve(posts)
    })
};


// get posts based on category num
module.exports.getPostsByCategory=function(category){
    return new Promise (function(resolve,reject) {
        var tempPost=[];
        for (var i = 0; i < posts.length; i++){
            if (posts[i].category == category){
                tempPost.push(posts[i]);
            }
        }
        if (tempPost.length === 0){
            var error = "Category Result Not Found"
            reject({message: error});
        }
        resolve(tempPost)
    })
}


// get posts based on min date
module.exports.getPostsByMinDate=function(minDate){
    return new Promise (function(resolve,reject) {
        var tempPost=[]
        for (var i = 0; i < posts.length; i++){
            if(new Date(posts[i].postDate) >= new Date(minDate)){
                tempPost.push(posts[i]);
            }            
        }
        if (tempPost.length === 0){
            var error = "Date Result Not Found"
            reject({message: error});
        }
        resolve(tempPost)
    })
}


// get specific post id
module.exports.getPostById=function(id){
    return new Promise (function(resolve,reject) {
        var tempPost
        for (var i = 0; i < posts.length; i++){
            if (posts[i].id == id){
                tempPost = posts[i]
            }
        }
        if (!tempPost){
            var error = "ID Result Not Found"
            reject({message:error});
        }
        resolve(tempPost)
    })
}