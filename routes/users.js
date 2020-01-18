var express   = require('express');
var userController = require('../controller/userr');
var {check}  = require('express-validator');

var router = express.Router();

router.get('/register',userController.registerPage);

router.post('/register',check('name').isLength(5).withMessage('name should be 5 character long'),
check('email').isEmail().withMessage('enter valid email'),
check('password').isLength(8).withMessage('password should be 8 character long'),
userController.registerUser);

router.get('/login',userController.loginPage);

router.post('/login',
check('email').isEmail().withMessage('enter valid email'),
check('password').isLength(8).withMessage('password should be 8 character long'),
userController.loginUser);


router.get('/logout',userController.logout);

module.exports=router;