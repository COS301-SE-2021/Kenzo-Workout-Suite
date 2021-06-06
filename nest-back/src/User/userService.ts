import {Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {PrismaService} from "../Prisma/prisma.service";

import {
    Client,
    Planner,
    Prisma
} from '@prisma/client';
import {AuthService} from "../auth/auth.service";
import prisma from "../../dist/client";

@Injectable()
export class UserService{

    constructor(private prisma: PrismaService,
        private authService: AuthService
    ) {
    }

    async signUpClient(firstName:string, lastName:string,password:string,email:string){
        if (firstName==null || lastName==null || password==null || email==null || firstName=="" || lastName==""  || password==""  || email=="" )
        {
            throw new NotFoundException("Parameters can not be left empty");
        }

        let passwordHash= await this.authService.hashPassword(password)

        await this.prisma.client.create(
            {
                data:{
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    password: passwordHash
                }
            }
        )

        return "Hello YOUNG ONEasdadsasdasdasdas";
    }

    signUpPlanner(firstName:string, lastName:string,password:string,email:string){

    }

    async signIn(email: string, password: string) {

        let User= await prisma.client.findUnique({
                where: {
                    email: email
                },
            })

        if (User==null)
        {
            return new UnauthorizedException("Credentials invalid");
        }

        if (await this.authService.comparePasswords(password,User.password))
        {
            return await this.authService.generateJWT(User);
        }

        else
        {
            return new UnauthorizedException("Credentials invalid");
        }

    }


    updateUser(firstName:string, lastName:string,password:string,email:string){

    }
}