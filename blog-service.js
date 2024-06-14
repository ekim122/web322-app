const env = require("dotenv")
env.config()

require('pg')
const Sequelize = require('sequelize');

var sequelize = new Sequelize(process.env.VERCEL_DATABASE, process.env.VERCEL_USER, process.env.VERCEL_PASS, {
    host: process.env.VERCEL_HOST,
    dialect: 'postgres',
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});


const Post = sequelize.define('Post',{
    postID:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    body:Sequelize.TEXT,
    title:Sequelize.STRING,
    postDate:Sequelize.DATE,
    featureImage:Sequelize.STRING,
    published:Sequelize.BOOLEAN
})

const Category = sequelize.define('Category',{
    categoryID:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    category:Sequelize.STRING
})

Post.belongsTo(Category, {foreignKey: 'category'});


//initialize blog by reading/loading files
module.exports.initialize = function(){
    return new Promise (function(resolve,reject){
        sequelize.sync()
        .then(()=>resolve())
        .catch(()=>reject("unable to sync the database"));
    })
};


// get all posts
module.exports.getAllPosts = function(){
    return new Promise (function(resolve,reject){
        Post.findAll()
        .then(()=>resolve(Post.findAll()))
        .catch(()=>reject("no results returned"));
    })
};


// get 'published = yes' posts only
module.exports.getPublishedPosts=function(){
    return new Promise (function(resolve,reject){
        Post.findAll({
            where:{
                published:true
            }
        })
        .then(function(data){resolve(data)})
        .catch(()=>reject("no results returned"));
    })
};


// get all categories
module.exports.getCategories = function(){
    return new Promise (function(resolve,reject){
        Category.findAll()
        .then(()=>resolve(Category.findAll()))
        .catch(()=>reject("no results returned"));
    })
};


// add post
module.exports.addPost=function(postData){
    postData.published = (postData.published) ? true : false;
    for(prop in postData){
        if (postData[prop] == ""){
            postData[prop] = null
        }
    }
    postData.postDate = new Date()
    return new Promise (function(resolve,reject){
        Post.create(postData)
        .then(()=>resolve())
        .catch(()=>reject("unable to create post"));
    })
};


// get posts based on category num
module.exports.getPostsByCategory=function(category){
    return new Promise (function(resolve,reject) {
        Post.findAll({
            where:{category:category}
        })
        .then(function(data){resolve(data)})
        .catch(()=>reject("no results returned"));
    })
}


// get posts based on min date
module.exports.getPostsByMinDate=function(minDate){
    return new Promise (function(resolve,reject) {
        const { gte } = Sequelize.Op;
        Post.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDate)
                }
            }
        })
        .then(function(data){resolve(data)})
        .catch(()=>reject("no results returned"));
    })
}


// get specific post id
module.exports.getPostById=function(id){
    return new Promise (function(resolve,reject) {
        Post.findAll({
            where:{
                postID: id
            }
        })
        .then(function(data){resolve(data[0])})
        .catch(()=>reject("no results returned"));
    })
}


// get category by filtering posts
module.exports.getPublishedPostsByCategory = function(category){
    return new Promise (function(resolve,reject){
        Post.findAll({
            where:{
                published:true,
                category:category
            }
        })
        .then(function(data){resolve(data)})
        .catch(()=>reject("no results returned"));
    })
};


// allow user to add category
module.exports.addCategory = function(categoryData){
    for(prop in categoryData){
        if(prop==""){
            prop=null
        }
    }
    return new Promise (function(resolve,reject){
        Category.create(categoryData)
        .then(()=>resolve())
        .catch(()=>reject("unable to create category"));
    })
};


// allow user to delete category
module.exports.deleteCategoryById = function(id){
    return new Promise (function(resolve,reject){
        Category.destroy({where:{categoryID:id}})
        .then(function(data){resolve(data)})
        .catch(()=>reject("unable to delete category"))
    })
};


// allow user to delete post
module.exports.deletePostById = function(id){
    return new Promise (function(resolve,reject){
        Post.destroy({where:{postID:id}})
        .then(function(data){resolve(data)})
        .catch(()=>reject("unable to delete post"))
    })
};