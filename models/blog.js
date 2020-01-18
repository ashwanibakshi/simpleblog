var mongoose = require('mongoose');
var user     = require('./user');

var blogSchema = new mongoose.Schema({
    title:{
        type:String
    },
    content:{
        type:String
    },
    author:{
        type:String
    },
    views:{
        type:Number
    },
    uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:user
    },
    tag:{
        type:String
    },
    image:{
        type:String
    },
        createdAt:{
            type:Date
        },
        updatedAt:{
            type:Date
        }
});

var blog = module.exports = mongoose.model('blogdata',blogSchema);

module.exports.saveArticle= (blogs,fn)=>{
             blogs.save((err,data)=>{
                 if(err){
                     fn(err,null)
                 }else{
                     fn(null,data)
                 }
             });
}

module.exports.viewArticle = (id,fn)=>{
            blog.find({'_id':id},(err,data)=>{
                 
                    if(err){
                        fn(err,null);
                    }else{
                      fn(null,data)
                    }
            });
} 

module.exports.getUserData=(uid,page,fn)=>{
        var perPage = 6
        var query ={}
        query.skip = (perPage * page) - perPage
        query.limit = perPage
        blog.find({'uid':uid},{},query,(err,data)=>{
                if(err){
                    fn(err,null)
                }else{
                    fn(null,data)
                }
            });
}

module.exports.getFrontData=(fn)=>{
        var perPage = 3
        var query ={}
        query.limit = perPage
       blog.find({},{},query,(err,data)=>{
           if(err){
               fn(err,null)
           }else{
               fn(null,data)
           }
       })
}
module.exports.getFrontPagination =(page,search,fn)=>{
    var perPage = 6;
    var query ={}
    query.limit = perPage
    query.skip=(perPage*page)-perPage;
    if(search==null || search==undefined){
   blog.find({},{},query,(err,data)=>{
       if(err){
           fn(err,null)
       }else{
           fn(null,data)
       }
   });
  }else{
      blog.find({$or:[{tag:{'$regex':search}},{author:{'$regex':search}}]},{},query,(err,data)=>{
               if(err){
                   fn(err,null)
               }else{
                   fn(null,data)
               }
      });
  }
}

module.exports.editData=(uidd,id,fn)=>{
    blog.find({$and:[{"_id":id},{"uid":uidd}]},(err,data)=>{
        if(err){
            fn(err,null)
        }else{
            fn(null,data)
        }
    });
}

module.exports.updateData =(blogData,uidd,id,fn)=>{
    blog.update({$and:[{"_id":id},{"uid":uidd}]},{$set:blogData},(err,data)=>{
        if(err){
            fn(err,null)
        }else{
            fn(null,data)
        }
    })
}

module.exports.removeArticle=(uidd,id,fn)=>{
    blog.deleteOne({$and:[{'uid':uidd},{'_id':id}]},(err,data)=>{
          if(err){
              fn(err,null)
          }else{
              fn(null,data)
          }
    }) 
}