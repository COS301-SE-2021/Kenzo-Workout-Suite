import { Injectable } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {Client} from "@prisma/client";
import prisma from "../../dist/client";

@Injectable()
export class UserService {
    constructor(private jwtService:JwtService) {

    }

    async findOne(email:string): Promise<Client | undefined>
    {
        return await prisma.client.findUnique({
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
