import { Injectable } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
//import {Client} from "@prisma/client";
import {
    Workout,
    Exercise,
    Difficulty,
    User,
    Prisma
} from '@prisma/client';
import {PrismaService} from "../Prisma/prisma.service";


@Injectable()
export class UserService {
    constructor(private jwtService:JwtService, private prisma: PrismaService) {

    }

    async findOne(email:string): Promise<User | null>
    {

        return await this.prisma.user.findUnique({
            where: {
                email: email
            },
        })

    }
    async validateUser(email:string, password:string): Promise<any>{
        const user= await this.findOne(email);

        if (user && user.password===password){
            const {password, ...rest}=user;
            return rest;
        }

        return null;
    }

    async login(user:any){
        const payload= {email: user.email};

        return{
            access_token: this.jwtService.sign(payload),
        };
    }



}
