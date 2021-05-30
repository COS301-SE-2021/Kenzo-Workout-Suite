const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const bcrypt= require('bcrypt');

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

async function countClient(myEmail) {
    return await prisma.client.count({
        where: {
            email: myEmail
        },
    });
}

async function countPlanner(myEmail) {
    return await prisma.planner.count({
        where: {
            email: myEmail
        },
    });
}

exports.signUpClient=async(req,res,next) =>
{
    if(await countClient(req.body.email)===1)
    {
        return res.status(500).json({
            error:"Client with email already exists"
        });
    }

    if(await countPlanner(req.body.email)===1)
    {
        return res.status(500).json({
            error:"Planner with email already exists"
        });
    }

    if(validateEmail(req.body.email)===false)
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
                        password:hash
                    }
                }
            )
                 .then(result=>
                 {
                     res.status(201).json(
                         {
                             message: 'Client created'
                         }
                     );
                 })
                 .catch(err=>
             {
                 console.log(err);
                 res.status(500).json(
                     {
                         error:err,
                         description:"Database error"
                     }
                 );
             });
        }
    })
}

exports.signUpPlanner=async (req, res, next) => {
    if (await countClient(req.body.email) === 1) {
        return res.status(500).json({
            error: "Client with email already exists"
        });
    }

    if (await countPlanner(req.body.email) === 1) {
        return res.status(500).json({
            error: "Planner with email already exists"
        });
    }

    if (validateEmail(req.body.email) === false) {
        return res.status(500).json({
            error: "Invalid email passed in"
        });
    }

    bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        } else {
            await prisma.planner.create(
                {
                    data: {
                        email: req.body.email.toLowerCase(),
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        password: hash
                    }
                }
            )
                .then(result => {
                    res.status(201).json(
                        {
                            message: 'Planner created'
                        }
                    );
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json(
                        {
                            error: err
                        }
                    );
                });
        }
    })
}



exports.signIn=async (req, res, next) => {

    let clientNumber=await countClient(req.body.email)
     let plannerCount=await countPlanner(req.body.email)

    if(clientNumber===1)
    {
        const user = await prisma.client.findUnique({
            where: {
                email: req.body.email
            },
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

        bcrypt.compare(req.body.password, user.password, (err,result) =>{
            if(err)
            {
                return res.status(401).json({
                    message: 'Authorisation failed'
                });
            }

            if(result)
            {
                return res.status(200).json(
                    {
                        message:'Client Authentication successful'
                    }
                )
            }

            return res.status(401).json(
                {
                    message:'Authorisation failed'
                }
            )
        });
    }

    else if(plannerCount === 1)
    {
        const user = await prisma.planner.findUnique({
            where: {
                email: req.body.email
            },
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

        bcrypt.compare(req.body.password, user.password, (err,result) =>{
            if(err)
            {
                return res.status(401).json({
                    message: 'Authorisation failed'
                });
            }

            if(result)
            {
                return res.status(200).json(
                    {
                        message:'Planner Authentication successful'
                    }
                )
            }

            return res.status(401).json(
                {
                    message:'Authorisation failed'
                }
            )
        });
    }

    else
    {
        return res.status(401).json(
            {
                message:'Authorisation failed'
            }
        )
    }
}

exports.updateUserDetails=async (req, res, next) => {
    const updateUser = await prisma.client.update({
        where: {
            email: req.body.email,
        },

        data: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
        },
    })
        .then(res.status(201).json(
            {
                message: 'User details updated',
            },
        ))
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

