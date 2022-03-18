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


const Post = sequelize.define('post',{
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

const Category = sequelize.define('category',{
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
        .then(()=>resolve())
        .catch(()=>reject("no results returned"));
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
    postData.published = (postData.published) ? true : false;
    for(x in postData){
        if(x==""){
            x=null
        }
    }
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
        .then(()=>resolve(Post.findAll({where:{category:category}})))
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
                    [gte]: new Date(minDateStr)
                }
            }
        })
        .then(()=>resolve(Post.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDateStr)
                }
            }
        })))
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
        .then(()=>resolve(Post.findAll({
            where:{
                postID: id
            }
        })))
        .catch(()=>reject("no results returned"));
    })
}


// get category by filtering posts
module.exports.getPublishedPostsByCategory = function(category){
    return new Promise (function(resolve,reject){
        reject();
    })
};