const express = require ('express');

const router = express.Router();

const userController=require("../controllers/userController")

/**
 * @swagger
 *  /signupClient:
 *      post:
 *          description: Creates a new entry for a client in the database
 *          parameters:
 *          - name: firstName
 *            description: Name of the client
 *            in: formData
 *            required: true
 *            type: String
 *
 *          responses:
 *              201:
 *                  description: Success
 */
router.post('/signupClient', userController.signUpClient);
router.post('/signupPlanner', userController.signUpPlanner);
router.post('/signin', userController.signIn);
router.post('/updateuser', userController.updateUserDetails);

module.exports = router;