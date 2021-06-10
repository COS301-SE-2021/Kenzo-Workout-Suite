import {Injectable, PreconditionFailedException} from '@nestjs/common';
import {PrismaService} from "../Prisma/prisma.service";
import { JwtService } from '@nestjs/jwt';
import {Client} from "@prisma/client";
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.findOne(username);
        const isMatch = await bcrypt.compare(pass, user.password);

        if (user && isMatch) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async findOne(email: string): Promise<any> {
        return await this.prisma.client.findUnique({
            where: {
                email: email
            },
        })
    }

    async login(user: any) {
        const payload = { email: user.email};
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async signUpClient(client:Client) : Promise<any>{
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

        return await this.prisma.client.create({
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

    validatePassword(password) {
        var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(password);
    }
}