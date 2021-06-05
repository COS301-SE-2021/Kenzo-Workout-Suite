import {Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
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

        if (firstName==null || lastName==null || password==null || email==null || firstName=="" || lastName==""  || password==""  || email=="" )
        {
            throw new NotFoundException("Parameters can not be left empty");
        }

        this.prisma.client.create(
            {
                data:{
                    email: email,
                    firstName:lastName,
                    lastName:password,
                    password: email
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