const express = require ('express');

const router = express.Router();

const userController=require("../controllers/userController")



router.post('/signupClient', userController.signUpClient);
router.post('/signupPlanner', userController.signUpPlanner);
router.post('/signIn', userController.signIn);
router.post('/updateUser', userController.updateUserDetails);
router.post('/getUserByEmail', userController.getUserByEmail);

module.exports = router;