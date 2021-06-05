import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PrismaService} from "../Prisma/prisma.service";

import {
    Client,
    Planner,
    Prisma
} from '@prisma/client';

@Injectable()
export class UserService{

    constructor(private prisma: PrismaService) {
    }

    async signUpClient(firstName:string, lastName:string,password:string,email:string){
        return this.prisma.client.create(
            {
                data:{
                    email: "zelutesema@gmail.com",
                    firstName:"Zelu",
                    lastName:"Tesema",
                    password: "Zelu2000#"
                }
            }
        )
    }

    signUpPlanner(firstName:string, lastName:string,password:string,email:string){

    }

    signIn(email:string,password:string){

    }

    getUserByEmail(email:string){
    }

    updateUser(firstName:string, lastName:string,password:string,email:string){

    }
}