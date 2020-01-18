var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path    = require('path');
var session = require('express-session');

//make connection to db
mongoose.connect('mongodb://localhost:27017/sampleblog',{useNewUrlParser:true})
.then(()=>console.log('connect to db'))
.catch((error)=>console.log('error in connection',error));

//init app
var app = express();

//set the template engine
app.set('view engine','ejs');

//set public folder path
app.use(express.static(path.join(__dirname,'/public')));

//fetch the data from request
app.use(bodyParser.urlencoded({extended:false}));

//session
app.use(session({
    secret:'this_IS_MYsecretkey1234',
    resave:false,
    saveUninitialized:false
}));

//locals variable
app.use((req,res,next)=>{
    res.locals.auth = req.session.uid;
    next();
});

//default page load
app.get('/',(req,res)=>{
    res.redirect('/blog/home');
});

app.use('/user',require('./routes/users'));
app.use('/blog',require('./routes/blogs'));

var port = process.env.PORT || 3000;
app.listen(port,()=>console.log('server run at  '+port));
