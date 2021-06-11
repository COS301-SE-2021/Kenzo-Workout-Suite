import {Injectable, NotFoundException, PreconditionFailedException} from '@nestjs/common';
import {PrismaService} from "../Prisma/prisma.service";
import { JwtService } from '@nestjs/jwt';
import {Client} from "@prisma/client";
import * as bcrypt from 'bcrypt';
import {Context} from "../../context";


@Injectable()
export class UserService {
    constructor(private jwtService: JwtService) {}

    async validateUser(username: string, pass: string, ctx: Context): Promise<any> {

        if (username==null || pass==null)
        {
            return new NotFoundException("Invalid Email or Password")
        }

        const user = await ctx.prisma.client.findUnique({
            where: {
                email: username
            },
        })

        if (user==null)
        {
            return new NotFoundException("Invalid Email or Password")
        }

        const isMatch = await bcrypt.compare(pass, user.password);

        if (isMatch) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email};
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async signUpClient(client:Client,ctx: Context) : Promise<any>{

        if (client==null)
        {
            return new PreconditionFailedException("Invalid client object")
        }

        const email=client.email.toLowerCase();

        if (!this.validateEmail(email))
        {
            return new PreconditionFailedException("Invalid email address")
        }

        if (!this.validatePassword(client.password)){
            return new PreconditionFailedException("Invalid password")
        }

        const saltOrRounds = 10;
        const hash = await bcrypt.hash(client.password, saltOrRounds);

        return await ctx.prisma.client.create({
            data: {
                firstName: client.firstName,
                lastName: client.lastName,
                email: email,
                password : hash
            },
        })
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