import {Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {PrismaService} from "../Prisma/prisma.service";

import {
    Client,
    Planner,
    Prisma
} from '@prisma/client';
import prisma from "../../dist/client";

@Injectable()
export class UserService{

    constructor(private prisma: PrismaService,
    ) {
    }

    async findOne(email:string): Promise<Client | undefined>
    {
        return await prisma.client.findUnique({
            where: {
                email: email
            },
        })

    }

    async signUpClient(firstName:string, lastName:string,password:string,email:string){
        if (firstName==null || lastName==null || password==null || email==null || firstName=="" || lastName==""  || password==""  || email=="" )
        {
            throw new NotFoundException("Parameters can not be left empty");
        }

        await this.prisma.client.create(
            {
                data:{
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    password: password
                }
            }
        )

        return "Hello YOUNG ONEasdadsasdasdasdas";
    }

    signUpPlanner(firstName:string, lastName:string,password:string,email:string){

    }

    async signIn(email: string, password: string) {

    }


    updateUser(firstName:string, lastName:string,password:string,email:string){

    }
}