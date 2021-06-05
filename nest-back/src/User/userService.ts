import {Injectable} from "@nestjs/common";
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
    signUpClient(firstName:string, lastName:string,password:string,email:string){
        return "hello"
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