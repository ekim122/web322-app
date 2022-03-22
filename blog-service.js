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
        .then(()=>resolve(Post.findAll({
            where:{
                published:true
            }
        })))
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


// START FROM HERE WHEN CHECKING
// add post
module.exports.addPost=function(postData){
    postData.published = (postData.published) ? true : false;
    for(prop in postData){
        if(prop==""){
            prop=null
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
        .then(()=>resolve(Post.findAll({
            where:{
                category:category
            }
        })))
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
        .then(()=>resolve(Post.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDate)
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
        // .then(()=>resolve(Post.findOne({
        //     where:{
        //         postID: id
        //     }
        // })))
        .then(function(data){
            resolve(data[0])
        })
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
        .then(()=>resolve(Post.findAll({
            where:{
                published:true,
                category:category
            }
        })))
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
        .then(()=>resolve( Category.destroy({where:{categoryID:id}}) ))
        .catch(()=>reject("unable to delete category"))
    })
};


// allow user to delete post
module.exports.deletePostById = function(id){
    return new Promise (function(resolve,reject){
        Post.destroy({where:{postID:id}})
        .then(()=>resolve( Post.destroy({where:{postID:id}}) ))
        .catch(()=>reject("unable to delete post"))
    })
};