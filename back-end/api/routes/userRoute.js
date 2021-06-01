const express = require ('express');

const router = express.Router();

const userController=require("../controllers/userController")


/**
 * @swagger
 *  /user/signupClient:
 *      post:
 *          summary: Used to sign up a client user
 *          consumes:
 *              - application/json
 *          parameters:
 *            - in: body
 *              name: client
 *              description: This use case creates a client
 *              schema:
 *                  type: object
 *                  required:
 *                    -firstName
 *                    -lastName
 *                    -email
 *                    -password
 *                  properties:
 *                      firstName:
 *                          type: string
 *                      lastName:
 *                          type: string
 *                      email:
 *                          type: string
 *                      password:
 *                          type: string
 *          responses:
 *              201:
 *                  description: Created client
 *              400:
 *                  description: Invalid entry or already existent client email
 *              500:
 *                  description: Internal database error
 */
router.post('/signupClient', userController.signUpClient);


/**
 * @swagger
 *  /user/signupPlanner:
 *      post:
 *          summary: Used to sign up a planner user
 *          consumes:
 *              - application/json
 *          parameters:
 *            - in: body
 *              name: client
 *              description: This use case creates a planner
 *              schema:
 *                  type: object
 *                  required:
 *                    -firstName
 *                    -lastName
 *                    -email
 *                    -password
 *                  properties:
 *                      firstName:
 *                          type: string
 *                      lastName:
 *                          type: string
 *                      email:
 *                          type: string
 *                      password:
 *                          type: string
 *          responses:
 *              201:
 *                  description: Created planner
 *              400:
 *                  description: Invalid entry or already existent client email
 *              500:
 *                  description: Internal database error
 */
router.post('/signupPlanner', userController.signUpPlanner);


/**
 * @swagger
 *  /user/signIn:
 *      post:
 *          summary:  Used to sign in to a specific user (Client or Planner)
 *          consumes:
 *              - application/json
 *          parameters:
 *            - in: body
 *              name: client
 *              description: Used to sign in to a specific user (Client or Planner)
 *              schema:
 *                  type: object
 *                  required:
 *                    -email
 *                    -password
 *                  properties:
 *                      email:
 *                          type: string
 *                      password:
 *                          type: string
 *          responses:
 *              200:
 *                  description: Authorisation successful
 *              400:
 *                  description: Invalid entry or already existent client email
 *              401:
 *                  description: Authorisation failed
 *              500:
 *                  description: Internal database error
 */
router.post('/signIn', userController.signIn);


/**
 * @swagger
 *  /user/updateUser:
 *      post:
 *          summary: Used to update the details of a specific user
 *          consumes:
 *              - application/json
 *          parameters:
 *            - in: body
 *              name: client
 *              description: Used to update the details of a specific user
 *              schema:
 *                  type: object
 *                  required:
 *                    -email
 *                    -firstName
 *                    -lastName
 *                    -dateOfBirth
 *                  properties:
 *                      email:
 *                          type: string
 *                      firstName:
 *                          type: string
 *                      lastName:
 *                          type: string
 *                      dateOfBirth:
 *                          type: string
 *          responses:
 *              201:
 *                  description: User has been updated
 *              400:
 *                  description: Invalid entry or already existent client email
 *              401:
 *                  description: Authorisation failed
 *              500:
 *                  description: Internal database error
 */
router.post('/updateUser', userController.updateUserDetails);

/**
 * @swagger
 *  /user/getUserByEmail:
 *      post:
 *          summary: Used to get the details of a user by email
 *          consumes:
 *              - application/json
 *          parameters:
 *            - in: body
 *              name: client
 *              description: Used to get the details of a user by email
 *              schema:
 *                  type: object
 *                  required:
 *                    -email
 *                  properties:
 *                      email:
 *                          type: string
 *          responses:
 *              201:
 *                  description: Valid user response
 *              400:
 *                  description: Invalid entry or already existent client email
 *              401:
 *                  description: Authorisation failed
 *              500:
 *                  description: Internal database error
 */
router.post('/getUserByEmail', userController.getUserByEmail);

module.exports = router;