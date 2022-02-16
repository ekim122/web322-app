const fs = require("fs");

var posts = [];
var categories = [];

module.exports.initialize = function(){
    return new Promise (function(resolve,reject){
        fs.readFile('./data/posts.json', 'utf8', (err, data) => {
            if (err){
                console.log("Unable to read posts file")
                //reject(err)
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
                //reject(err)
                reject("Unable to read categories file")
            }else{
                categories = JSON.parse(data)
                console.log("Categories initialization successful")
                resolve(categories)
            }
        });
    })
};

module.exports.getAllPosts = function(){
    return new Promise (function(resolve,reject){
        if(posts.length === 0){
            reject("No results from 'getAllPosts' returned")
        }else{
            resolve(posts)
        }
    })
};

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

module.exports.getCategories = function(){
    return new Promise (function(resolve,reject){
        if(categories.length === 0){
            reject("No results from 'getCategories' returned")
        }else{
            resolve(categories)
        }
    })
};
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
