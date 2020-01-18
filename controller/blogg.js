var blogModel = require('../models/blog');


exports.home=(req,res)=>{
    try {
        var page=1;
        var perPage=6
        if(req.query.page){
          page=req.query.page;
        }
        console.log(req.query.search)
          blogModel.getFrontData((err,data)=>{
               blogModel.getFrontPagination(page,req.query.search,(err,pageresult)=>{
                  if(err){
                    console.log(err);
                  }else{
                   blogModel.count((err, count)=>{
                     console.log('count',count)
                      if (err) return next(err) 
                      res.locals.page_title="home"
                      console.log('FRONT',page);
                      res.render('pages/home', {
                          data: data,
                          pagee:pageresult,
                          current: page,
                          pages: Math.ceil(count / perPage),
                          pagetitle:'home'
                      });
                  });  
                  }
               });
          });
      } catch (error) {
           console.log(error);
      }
}

exports.viewArticleById =(req,res)=>{
    try {
        blogModel.viewArticle(req.params.id,(err,data)=>{
            if(err){
              console.log(err);
            }else{
              console.log(data);
              if(data[0].views==undefined){
                data[0].views = 1;
              }else{
                data[0].views +=1;
              }
              var up = {
                 views:data[0].views
              }
              //updating the view
              blogModel.update({"_id":req.params.id},{$set:up},(err,updata)=>{
                console.log(updata)
                res.render('pages/single',{data:data,pagetitle:data[0].title})
              })
            }
          });
    } catch (error) {
        console.log(error)
    }
}

exports.dashBoard = (req,res)=>{
    try {
        var page = 1;
        var perPage = 6
        if(req.query.page){
          page = req.query.page;
        }
         blogModel.getUserData(req.session.uid,page,(err,data)=>{
               if(err){
                 console.log(err)
               }else{
                console.log('fdf')
                blogModel.count((err, count)=>{
                    console.log('count',count)
                     if (err) return next(err) 
                     res.locals.page_title="home"
                     res.render('pages/dashboard', {
                         data: data,
                         current: page,
                         pages: Math.ceil(count / perPage),
                         pagetitle:'dashboard'
                     });
                 });  
               }
         }); 
       } catch (error) {
           console.log(error);
       }
}

exports.editById = (req,res)=>{
    try {
        blogModel.editData(req.session.uid,req.params.id,(err,data)=>{
          if(err){
            console.log(err);
          }else{
              res.render('pages/edit',{data:data,pagetitle:''});
          }
        }) 
    } catch (error) {
        console.log(error);
    }
}

//update the article
exports.edit = (req,res)=>{
    try {
        var path = '/uploads/'+req.file.originalname;
  var blogData ={
    content:req.body.content,
    title:req.body.title,
    updatedAt:Date.now(),
    tag:req.body.tag,
    image:path,
    author:req.session.name,
    uid:req.session.uid
 };
      blogModel.updateData(blogData,req.session.uid,req.body.id,(err,data)=>{
         if(err){
           console.log(err);
         }else{
          res.redirect('/blog/dashboard')
         }
      })
    } catch (error) {
        console.log(error);
    }
}

exports.addArticle = (req,res)=>{
    try {
        res.render('pages/addarticle',{pagetitle:'addarticle'}); 
      } catch (error) {
        console.log(error);
      }
}

exports.addArticlePost = (req,res)=>{
    try {
        var path = '/uploads/'+req.file.originalname;
        var date = Date.now();
         var blog = new blogModel({
            content:req.body.content,
            title:req.body.title,
            image:path,
            createdAt:Date.now(),
            tag:req.body.tag,
            author:req.session.name,
            uid:req.session.uid
         });
        blogModel.saveArticle(blog,(err,data)=>{
          if(err){
            console.log(err)
          }else{
             res.render('pages/addarticle',{data:"",pagetitle:"AddArticle"})
          }
        })
      } catch (error) {
         console.log(error);
      }
}

exports.deleteArticle = (req,res)=>{
    try {
        blogModel.removeArticle(req.session.uid,req.params.id,(err,data)=>{
           if(err){
             console.log(err);
           }else{
              res.redirect('/blog/dashboard');
           }
        })
 } catch (error) {
   console.log(error);
 }
}