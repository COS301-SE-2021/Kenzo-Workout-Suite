const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const bcrypt= require('bcrypt');

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

exports.signUp=(req,res,next) =>
{
    if( validateEmail(req.body.email)===false)
    {
        return res.status(500).json({
            error:"Invalid email passed in"
        });
    }

    bcrypt.hash(req.body.password, 10 ,async (err,hash) =>
    {
        if(err)
        {
            return res.status(500).json({
                error:err
            });
        }

        else
        {
             await prisma.client.create(
                {
                    data:{
                        email: req.body.email.toLowerCase(),
                        firstName:req.body.firstName,
                        lastName:req.body.lastName,
                        userType:req.body.userType,
                        password:hash
                    }
                }
            )
                 .then(result=>
                 {
                     res.status(201).json(
                         {
                             message: 'User created'
                         }
                     );
                 })
                 .catch(err=>
             {
                 console.log(err);
                 res.status(500).json(
                     {
                         error:err
                     }
                 );
             });
        }
    })
}

exports.signIn=(req,res,next) =>
{

}

exports.setUserName=(req,res,next) =>
{

}

exports.setLastName=(req,res,next) =>
{

}

exports.setDateOfBirth=(req,res,next) =>
{

}

exports.setPassword=(req,res,next) =>
{

}

exports.getUserName=(req,res,next) =>
{

}

exports.getLastName=(req,res,next) =>
{

}

exports.getDateOfBirth=(req,res,next) =>
{

}
