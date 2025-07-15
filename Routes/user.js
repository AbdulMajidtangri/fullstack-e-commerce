const express = require('express');
const router = express.Router();
const userController = require('../Controller/user');
const { requireAuth } = require('../service/user')
const upload = require('../middleware/upload'); // Import multer middleware

router.get('/signup', userController.showusersignup);
router.get('/signin', userController.showusersignin);
router.post('/signup', upload.single('ProfileImage'), userController.handleuserSignup); // Use multer for signup
router.post('/signin', userController.handleuserSignin);
router.post('/logout', userController.handleuserlogout);
router.get('/logout', userController.handleuserlogout);
router.get('/cart',requireAuth,userController.showcartpage);
router.post('/add-to-cart/:productId', requireAuth, userController.addToCart);
module.exports = router;