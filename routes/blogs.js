var express   = require('express');
var blogController = require('../controller/blogg');
var checkAuth = require('../config/auth');
var multer    = require('multer');

var storage = multer.diskStorage({
    destination:(req,file,cb)=>{

       cb(null,'public/uploads')
    },
    filename:(req,file,cb)=>{
      cb(null,file.originalname);
    }  
});

var upload = multer({storage:storage});

var router = express.Router();

router.get('/home',blogController.home);

router.get('/viewarticle/:id',blogController.viewArticleById);

router.get('/dashboard',checkAuth,blogController.dashBoard);

router.get('/edit/:id',checkAuth,blogController.editById);

router.post('/edit',checkAuth,upload.single('file'),blogController.edit);

router.get('/addarticle',checkAuth,blogController.addArticle);

router.post('/addarticle',checkAuth,upload.single('file'),blogController.addArticlePost);

router.get('/delete/:id',checkAuth,blogController.deleteArticle);

module.exports = router;