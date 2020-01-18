var userModel = require('../models/user');
var {validationResult}  = require('express-validator');

exports.registerPage =(req,res)=>{
    res.render('pages/register',{pagetitle:'register',error:''});
}
var errors;
exports.registerUser=(req,res)=>{
    try {
         errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors.array());
            res.render('pages/register',{pagetitle:'register',error:errors.array()});
        }else{
        var user = new userModel({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        });
        userModel.register(user,(err,data)=>{
            if(err){
                console.log(err);
                 errors=[{
                    msg:'email already registered'
                }]
                res.render('pages/register',{pagetitle:'register',error:errors});
            }else{
            if(data!=null){
            res.redirect('/user/login')
            }
          }
        })
       }  
    } catch (error) {
        console.log(error);
    }
}

exports.loginPage = (req,res)=>{
    try {
        res.render('pages/login',{pagetitle:'login',error:''});   
      }catch (error) {
          console.log(error);
      }
}

exports.loginUser = (req,res)=>{
    try {
        errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log('login',errors.array())
            res.render('pages/login',{pagetitle:'login',error:errors.array()});
        }else{
        userModel.getUserEmail(req.body.email,(err,data)=>{
            if(err){
                errors=[{
                    msg:"some error occured"
                }]
                res.render('pages/login',{error:errors,pagetitle:'login'});
            }else{
                  if(data==''){
                      console.log('df')
                      errors=[{
                          msg:"user not registered"
                      }]
                    res.render('pages/login',{error:errors,pagetitle:'login'});
                  }else{
                    //   console.log(data[0].password)
                 userModel.comparePassword(req.body.password,data[0].password,(err,result)=>{
                          if(result){
                              console.log('password match');
                              req.session.email = data[0].email;
                              req.session.name  = data[0].name;
                              req.session.uid    = data[0]._id;
                              res.redirect('/blog/dashboard');
                          }else{
                            errors=[{
                                msg:"password didnt match"
                            }]
                              res.render('pages/login',{error:errors,pagetitle:'login'});
                          }
                    });
                }
            }
        });
       }
     } catch (error) {
          console.log(error);
     }
}

exports.logout=(req,res)=>{
    req.session.destroy();
    res.redirect('/user/login')
}