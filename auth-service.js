var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    "userName":{
        "type":String,
        "unique":true
    },
    "password":String,
    "email":String,
    "loginHistory":[{
        "dateTime":Date,
        "userAgent":String
    }]
})

let User; // to be defined on new connection (see initialize)


//initialize
module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://dbUser:dbUser2022@senecaweb.k3enu.mongodb.net/web322-app?retryWrites=true&w=majority");

        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           resolve();
        });
    });
};


//register
module.exports.registerUser = function(userData){
    return new Promise(function(resolve, reject){
        if (userData.password != userData.password2){
            reject("Passwords do not match")
        }
        else{
            let newUser = new User(userData)
            newUser.save((err)=>{
                if (err) {
                    if (err.code == 11000){
                        reject("User Name already taken")
                    }
                    reject("There was an error creating the user: " + err)
                }
                else{
                    resolve()
                }
            })
        }
    })
}