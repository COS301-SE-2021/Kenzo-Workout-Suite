const express = require ('express');

const router = express.Router();

const userController=require("../controllers/userController")

/**
 * @swagger
 * /books:
 *  get:
 *      summary: signs in a client
 *      responses:
 *          200:
 *              description:response
 *
 */
router.post('/signupClient', userController.signUpClient);
router.post('/signupPlanner', userController.signUpPlanner);
router.post('/signin', userController.signIn);
router.post('/updateuser', userController.updateUserDetails);

module.exports = router;