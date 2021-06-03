exports.orders_getall= (req,res,next) =>
{
    res.status(200).json({
        message:"Examples were the fetched from controller"
    });
}

exports.orders_create_order=(req,res,next) =>
{
    const order={
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message:"Examples were created in controller",
        order:order
    });
}

exports.orders_getDetails= (req,res,next) =>
{
    res.status(200).json({
        message:"Examples details in the controller",
        exampleMessage: req.params.exampleParameter
    });
}
