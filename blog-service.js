const env = require("dotenv")
env.config()

const Sequelize = require('sequelize');
var sequelize = new Sequelize('d5sokonv8preti', 'titcjemnfqgzzr', '2a74e430794952a116a7e378f403b5e025774e04aad627220bf8da7ae4f1a65c', {
    host: 'ec2-44-194-167-63.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});


//initialize blog by reading/loading files
module.exports.initialize = function(){
    return new Promise (function(resolve,reject){
        reject();
    })
};


// get all posts
module.exports.getAllPosts = function(){
    return new Promise (function(resolve,reject){
        reject();
    })
};


// get 'published = yes' posts only
module.exports.getPublishedPosts=function(){
    return new Promise (function(resolve,reject){
        reject();
    })
};


// get all categories
module.exports.getCategories = function(){
    return new Promise (function(resolve,reject){
        reject();
    })
};


// add post
module.exports.addPost=function(postData){
    return new Promise (function(resolve,reject){
        reject();
    })
};


// get posts based on category num
module.exports.getPostsByCategory=function(category){
    return new Promise (function(resolve,reject) {
        reject();
    })
}


// get posts based on min date
module.exports.getPostsByMinDate=function(minDate){
    return new Promise (function(resolve,reject) {
        reject();
    })
}


// get specific post id
module.exports.getPostById=function(id){
    return new Promise (function(resolve,reject) {
        reject();
    })
}


// get category by filtering posts
module.exports.getPublishedPostsByCategory = function(category){
    return new Promise (function(resolve,reject){
        reject();
    })
};