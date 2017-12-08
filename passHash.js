/**
 * Created by japjohal on 2017-11-16.
 */
var bhash = require("bcrypt");
const saltRounds = 10;


// module.exports.hash = function (password) {
//     return new Promise(function (resolve,reject) {
//      this method needs to be called. then that needs to be evaluated
//         bhash.hash(password,saltRounds,function (err,hash) {
//             if(err){reject(err)} // if error return promise in the error stats
//             resolve(hash); // if okay return the promise in the .then status
//         })
//     })
// };

module.exports.hash = function(user,pass,ver) {
    return promise(user,pass,ver);

};

function promise(user,pass,ver) {
    return new Promise((resolve,reject) =>{
        if (passCheck(pass) == false){
            reject("Pass cannot be empty")
        }
        bhash.hash(pass,saltRounds,function (err,hash) {
            if(err){reject("Hash was unable to be created")}

            var obj = {
                userName:user,
                passWord:hash,
                twofactor:ver
            }
            resolve(obj);
        })
    })

}

module.exports.decrypt = function (password,hash) {
    bhash.compare(password,hash,function (err,res) {
        if(err){console.log(err);}
        console.log(res+ " password response");
        if(res==true){
            return true;
        }
        else{
            return false;
        }
    })
}
function passCheck(pass) {
    if(!pass){
        console.log(pass);

        return false;
    }
}
