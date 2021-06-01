const express = require('express');
const app= express();
const morgan= require('morgan');
const bodyParser= require('body-parser');
const exampleRoute= require('./api/routes/exampleRoute');
const userRoute= require('./api/routes/userRoute');
const workoutRoute = require('./api/routes/workoutRoute');

const swaggerJsDoc= require('swagger-jsdoc');
const swaggerUI= require('swagger-ui-express');
// This is middleware. incoming requests have to go through the middleware.
const swaggerOptions = {
    swaggerDefinition:{
        info:{
            title: 'Kenzo Workout Creation API',
            servers: ["http://localhost:5500"]
        }
    },
    apis: ["./api/routes/*.js"]
};

const swaggerDocs= swaggerJsDoc(swaggerOptions);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

app.use((req,res,next) =>
{
    res.header('Access-Control-Allow', '*');
    res.header('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS')
    {
        res.header('Access-Control-Allow-Methods' , 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})


app.use('/example' , exampleRoute);
app.use('/user' , userRoute);
app.use('/workout' , workoutRoute);

app.use((req, res, next)=>
{
    const error= new Error('Not found');
    error.status=404;
    next(error);
})

app.use((error, req, res,next) =>
{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;