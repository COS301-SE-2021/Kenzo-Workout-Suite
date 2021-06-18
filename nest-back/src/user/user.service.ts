import {BadRequestException, Injectable, NotFoundException, PreconditionFailedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {User} from "@prisma/client";
import * as bcrypt from 'bcrypt';
import {Context} from "../../context";
import { v4 as uuid } from 'uuid';


@Injectable()
export class UserService {
    constructor(private jwtService: JwtService) {}

    /**
     *User Service - Validate User
     *
     * @param email This is the email address of the user to be validated
     * @param pass This is the password of the user that is to be validated
     * @param ctx  This is the prisma context that is injected into the function
     * @throws NotFoundException if:
     *                               -An empty email address is passed in.
     *                               -An empty password is passed in
     *                               -Invalid combination of email address and password
     * @return  Promise user object without the password.
     * @author Zelealem Tesema
     *
     */
    async validateUser(email: string, pass: string, ctx: Context): Promise<any> {

        if (email==null || pass==null)
        {
            throw new NotFoundException("Invalid Email or Password")
        }

        const user = await ctx.prisma.user.findUnique({
            where: {
                email: email
            },
        })

        if (user==null)
        {
            throw new NotFoundException("Invalid Email or Password")
        }

        const isMatch = await bcrypt.compare(pass, user.password);

        if (!isMatch)
        {
            throw new NotFoundException("Invalid Email or Password")
        }

            const { password, ...result } = user;
            return result;

    }

    /**
     * User Service- login
     * @param user This is the user object with the email address and password that need to be validated.
     * @throws NotFoundException if:
     *                          -An empty user object is passed into the function
     *                          -A user object without the field 'userId' is passed into the function
     *
     * @return Promise that consists of the access token
     *
     * @author Zelealem Tesema
     */
    async login(user: any) {
        if (user==null)
        {
            throw new NotFoundException("Invalid user object passed in.")
        }

        if (user.userId==null)
        {
            throw new NotFoundException("User object with no userId passed in")
        }

        const payload = { userId: user.userId};

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    /**
     *User Service - Sign Up
     *
     * @param user This is the user object that consists of the following details:
     *              -firstName
     *              -lastName
     *              -email
     *              -userType
     *              -password
     *
     * @param ctx
     *
     * @throws PreconditionFailedException if:
     *                          -Empty/null user object is passed into the function
     *                          -Email address that does not conform to the email address standard is passed in
     *                          -Password that does not conform to the password standard is passed in (atleast 8 characters consisting of one lower case, one upper case, one number and one special character)
     *
     *@throws BadRequestException if:
     *                          -A user with the passed in Users email already exists in the database.
     *
     *@return Promise This promise consists the JWT access token.
     *@author Zelealem Tesema
     *
     */
    async signUp(user:User,ctx: Context) : Promise<any>{



        if (user==null)
        {
            throw new PreconditionFailedException("Invalid user object")
        }

        const email=user.email.toLowerCase();

        if (!this.validateEmail(email))
        {
            throw new PreconditionFailedException("Invalid email address")
        }

        if (!this.validatePassword(user.password)){
            throw new PreconditionFailedException("Invalid password")
        }

        const saltOrRounds = 10;
        const hash = await bcrypt.hash(user.password, saltOrRounds);


        const countEmail= await ctx.prisma.user.count({
            where:{
                email: user.email
            }
        })


        if (countEmail>=1) {
            throw new BadRequestException("User with this email already exists")
        }

        const createdUser= await ctx.prisma.user.create({
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                userType:user.userType,
                email: email,
                password : hash
            },
        })


        if (!createdUser) {
            throw new BadRequestException("Could not create User")
        }

        return this.login(createdUser);
    }



    /**
     * User Service - findUserByUUID
     *
     * @param passedUserId This is the ID for which the user details are being searched for.
     * @param ctx This is the prisma context that can be mocked.
     *
     * @throws BadRequestException if:
     *                             -An empty or null user ID is passed into the function
     *                             -The database fails to retrieve the user details
     *
     *@throws NotFoundException if:
     *                          -No user with such UUID exists.
     *
     *@return Promise This returns the details of the user.
     *
     * @author Zelealem Tesema
     */
    async findUserByUUID(passedUserId: string, ctx: Context) : Promise<any>{

        if (passedUserId===null || passedUserId==="")
        {
            throw new BadRequestException("Null values cannot be passed in for userId")
        }


    try {
        const user = await ctx.prisma.user.findUnique({
            where: {
                userId: passedUserId
            },
        })

        if (!user){
            throw new NotFoundException("No user with such UUID")
        }

        const { password, userId, ...result } = user;
        return result;
    }
        catch (err)
        {
            throw new BadRequestException("No user with such UUID")
        }
    }

    /**
     * User Service - Update user details
     *
     * @param firstName This is the first name of the user that is required to be updated
     * @param lastName  This is the last name of the user that is required to be updated.
     * @param dateOfBirth  This is the date of birth of the user that is required to be updated.
     * @param userId    This is the user ID of the user that is required to be updated. ( This UserID should be passed in through the bearer token Authorisation header)
     * @param ctx   This is the prisma context that can be passed in as a mock
     *
     * @throws BadRequestException if:
     *                          -Null values are passed in for the firstName, LastName or userID
     *                          -Empty values are passed in for the firstName, LastName or userID
     *                          -The user details could not be updated
     *
     * @author Zelealem Tesema
     */
    async updateUserDetails(firstName:string,lastName:string, dateOfBirth:Date,userId:string,ctx:Context){
        if (firstName==null || lastName==null || userId==null || firstName=="" || lastName=="" || userId=="")
        {
            throw new BadRequestException("Null values can not be passed in for firstName, lastName or userId")
        }

        const updatedUser=await ctx.prisma.user.update({
        where:{
        userId: userId,
        },
        data:{
            firstName:firstName,
            lastName:lastName,
            dateOfBirth:dateOfBirth
        },
        })

        if (updatedUser===null)
        {
            throw new BadRequestException("Could not update user")
        }

        return {
            message: 'User data updated'
        }
    }

    async googleLogin(req) {
        if (!req)
        {
            throw new BadRequestException("No such google user")
        }

        if (!req.user) {
            throw new BadRequestException("No such google user")
        }

        return {
            message: 'User information from google',
            user: req.user
        }
    }

    /**
     * User Service- validateEmail
     *
     * @param email This is the email address that needs to be validated within the function
     *
     * @return true if:
     *              - The email conforms to the email standards.
     *
     * @return false if:
     *              - The email address does not conform to the email standards.
     *
     * @author Zelealem Tesema
     */
     validateEmail(email:string){
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());

    }

    /**
     * User Service- validatePassword
     *
     * @param password
     *
     * @return true if:
     *          - The password consists of atleast 8 characters, of which atleast one character is a lowercase alphabet, one character is an uppercase alphabet, one character is a digit and one is a special character
     *
     * @return false if:
     *          -Passsword does not consist of a lower case character
     *          -Password does not consist of an upper case character
     *          -Password does not consist of a special character
     *          -Password is shorter than 8 characters
     *
     *@author Zelealem Tesema
     */
     validatePassword(password:string) {
        const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(password);
    }
}