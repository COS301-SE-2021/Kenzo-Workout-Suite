import {BadRequestException, Injectable, NotFoundException, PreconditionFailedException} from '@nestjs/common';
import {PrismaService} from "../Prisma/prisma.service";
import { JwtService } from '@nestjs/jwt';
import {User} from "@prisma/client";
import * as bcrypt from 'bcrypt';
import {Context} from "../../context";


@Injectable()
export class UserService {
    constructor(private jwtService: JwtService) {}

    async validateUser(username: string, pass: string, ctx: Context): Promise<any> {

        if (username==null || pass==null)
        {
            throw new NotFoundException("Invalid Email or Password")
        }

        const user = await ctx.prisma.user.findUnique({
            where: {
                email: username
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

        if (isMatch) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { userId: user.userId};
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async signUp(user:User,ctx: Context) : Promise<any>{

        if (user==null)
        {
            return new PreconditionFailedException("Invalid client object")
        }

        const email=user.email.toLowerCase();

        if (!this.validateEmail(email))
        {
            return new PreconditionFailedException("Invalid email address")
        }

        if (!this.validatePassword(user.password)){
            return new PreconditionFailedException("Invalid password")
        }

        const saltOrRounds = 10;
        const hash = await bcrypt.hash(user.password, saltOrRounds);

        const countEmail= await ctx.prisma.user.count({
            where:{
                email: user.email
            }
        })

        if (countEmail===1)
        {
            return new BadRequestException("User with this email already exists")
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

        if (!createdUser)
        {
            return new BadRequestException("Could not create User")
        }

        return this.login(createdUser);
    }

    async findUserByUUID(userId: string,ctx: Context) : Promise<any>{

        if (userId===null || userId==="")
        {
            throw new BadRequestException("Null values cannot be passed in for userId")
        }

        const user = await ctx.prisma.user.findUnique({
            where: {
                userId: userId
            },
        })

        if (!user){
            throw new NotFoundException("No user with such UUID")
        }

        return user;
    }

    googleLogin(req) {
        if (!req.user) {
            return 'No user from google'
        }

        return {
            message: 'User information from google',
            user: req.user
        }
    }

    validateEmail(email:string){
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());

    }

    validatePassword(password:string) {
        const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(password);
    }
}