const express = require ('express');

const router = express.Router();

const exampleController=require("../controllers/exampleController")

router.get('/', exampleController.orders_getall );

router.post('/', exampleController.orders_create_order);

router.get('/:exampleParameter', exampleController.orders_getDetails);


module.exports = router;