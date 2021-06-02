const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const bcrypt= require('bcrypt');

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
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
    if (req.body.firstName==="")
    {
        return res.status(400).json({
            error:"User with empty name"
        });
    }

    if (req.body.lastName==="")
    {
        return res.status(400).json({
            error:"User with empty lastname"
        });
    }

    if(await countClient(req.body.email)===1)
    {
        return res.status(400).json({
            error:"Client with email already exists"
        });
    }

    if(await countPlanner(req.body.email)===1)
    {
        return res.status(400).json({
            error:"Planner with email already exists"
        });
    }

    if(validateEmail(req.body.email)===false)
    {
        return res.status(400).json({
            error:"Invalid email passed in"
        });
    }

    if (validatePassword(req.body.password)===false)
    {
        return res.status(400).json({
            error:"Invalid password"
        });
    }

    bcrypt.hash(req.body.password, 10 ,async (err,hash) =>
    {
        if(err)
        {
            return res.status(500).json({
                error:"Password hashing error."
            });
        }

        else
        {
            try
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

                return res.status(201).json(
                    {
                        message: 'Client created'
                    }
                );
            }

            catch(err)
            {
                return res.status(500).json(
                    {
                        error:err,
                        description:"Internal database error"
                    }
                );
            }
        }
    })
}

exports.signUpPlanner=async (req, res, next) => {

    if (req.body.firstName==="")
    {
        return res.status(400).json({
            error:"User with empty name"
        });
    }

    if (req.body.lastName==="")
    {
        return res.status(400).json({
            error:"User with empty lastname"
        });
    }

    if (await countClient(req.body.email) === 1) {
        return res.status(500).json({
            error: "Client with email already exists"
        });
    }

    if (await countPlanner(req.body.email) === 1) {
        return res.status(400).json({
            error: "Planner with email already exists"
        });
    }

    if (validateEmail(req.body.email) === false) {
        return res.status(400).json({
            error: "Invalid email passed in"
        });
    }

    if (validatePassword(req.body.password)===false)
    {
        return res.status(400).json({
            error:"Invalid password"
        });
    }

    bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        } else {
            try
            {
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
                return res.status(201).json(
                    {
                        message: 'Planner created'
                    }
                );

            }
            catch (err)
            {
                return res.status(500).json(
                    {
                        error:err,
                        description:"Internal database error"
                    }
                );
            }
        }
    })
}

exports.signIn=async (req, res, next) => {

    if(req.body.email==="" || req.body.password==="")
    {
        return res.status(400).json(
            {
                message: "empty email address"
            }
        );
    }


    else if(await countClient(req.body.email)===1)
    {
        try
        {
            const user = await prisma.client.findUnique({
                where: {
                    email: req.body.email
                },
            })

            bcrypt.compare(req.body.password, user.password, (err,result) =>{
                if(err)
                {
                    return res.status(401).json({
                        message: 'Authorisation failed'
                    });
                }

                else if(result)
                {
                    return res.status(200).json(
                        {
                            message:'Client Authentication successful'
                        }
                    )
                }

                else
                {
                    return res.status(401).json(
                        {
                            message:'Authorisation failed'
                        }
                    )
                }
            });
        }

        catch (err)
        {
            return res.status(500).json(
                {
                    error:err,
                    description:"Internal database error"
                }
            );
        }


    }

    else if(await countPlanner(req.body.email)===1)
    {

        try
        {
            const user = await prisma.planner.findUnique({
                where: {
                    email: req.body.email
                },
            })

            bcrypt.compare(req.body.password, user.password, (err,result) =>{
                if(err)
                {
                    return res.status(401).json({
                        message: 'Authorisation failed'
                    });
                }

                else if(result)
                {
                    return res.status(200).json(
                        {
                            message:'Planner Authentication successful'
                        }
                    )
                }

                else
                {
                    return res.status(401).json(
                        {
                            message:'Authorisation failed'
                        }
                    )
                }

            });
        }

        catch(err)
        {
            return res.status(500).json(
                {
                    error:err,
                    description:"Internal database error"
                }
            );
        }
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

    if(req.body.email==='' || req.body.firstName==='' || req.body.lastName==='' || req.body.dateOfBirth==='')
    {
        return res.status(400).json(
            {
                message: "empty parameters passed in"
            }
        );
    }


    if(await countClient(req.body.email)===1) {
        try
        {
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

            return res.status(201).json(
                {
                    message: 'Client user details updated'
                }
            )
        }

        catch(err)
        {
            return res.status(500).json(
                {
                    error:err,
                    description:"Internal database error"
                }
            );
        }
    }

    else if(await countPlanner(req.body.email)===1)
    {
        try
        {
            const updateUser = await prisma.planner.update({
                where: {
                    email: req.body.email,
                },

                data: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    dateOfBirth: req.body.dateOfBirth,
                },
            })

            return res.status(201).json(
                {
                    message: 'Planner user details updated',
                },
            )
        }

        catch (err)
        {
            return res.status(500).json(
                {
                    error:err,
                    description:"Internal database error"
                }
            );
        }
    }

    else
    {
        return res.status(401).json(
            {
                message:'User with such email does not exist'
            }
        )
    }

}


exports.getUserByEmail=async (req, res, next) => {

    if(req.body.email==="" || req.body.email===null)
    {
        return res.status(400).json(
            {
                message: "empty email address"
            }
        );
    }

    if(await countClient(req.body.email)===1) {
        try
        {
            const user = await prisma.client.findUnique({
                where: {
                    email: req.body.email
                },

            })

            return res.status(201).json(
                {
                            email : user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            dateOfBirth: user.dateOfBirth
                }
            )
        }

        catch(err)
        {
            return res.status(500).json(
                {
                    error:err
                }
            );
        }
    }

    else if(await countPlanner(req.body.email)===1)
    {
        try
        {
            const user = await prisma.planner.findUnique({
                where: {
                    email: req.body.email
                },
            })

            return res.status(201).json(
                {
                    email : user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    dateOfBirth: user.dateOfBirth
                }
            )
        }

        catch (err)
        {
            return res.status(500).json(
                {
                    error:err,
                    description:"Internal database error"
                }
            );
        }
    }

    else
    {
        return res.status(401).json(
            {
                message:'No user with email address exists'
            }
        )
    }

}


