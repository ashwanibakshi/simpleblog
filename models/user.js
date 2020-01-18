var mongoose = require('mongoose');
var bcrypt   = require('bcryptjs');


var userSchema = new  mongoose.Schema({
    email:{type:String,unique:true},
    name:{type:String},
    password:{type:String}
});

var User = module.exports  = mongoose.model('user',userSchema);

module.exports.register=(users,fn)=>{
    console.log(users)
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(users.password, salt, function(err, hash) {
               users.password=hash;
               users.save((err,data)=>{
                if(err){
                    fn(err,null)
                }else{
                    console.log('dfdf')
                    fn(null,data)
                }
            })
        });
    });
}

module.exports.getUserEmail=(email,fn)=>{
       User.find({"email":email},(err,data)=>{
                if(err){
                    fn(err,null)
                }else{
                    console.log('dd',data)
                    fn(null,data)
                }
       });
}

module.exports.comparePassword=(pass,hash,fn)=>{
    bcrypt.compare(pass, hash, function(err, result) {
        fn(null,result)
    });
}
