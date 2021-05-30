const express = require ('express');

const router = express.Router();

const userController=require("../controllers/userController")

router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);
router.post('/updateuser', userController.updateUserDetails)

module.exports = router;