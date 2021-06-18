import { ApiProperty } from "@nestjs/swagger";
import {User} from "@prisma/client";

export class updateUserDTO{
    @ApiProperty({type: String, description: 'Name of the user'})
    firstName: string;

    @ApiProperty({type: String, description: 'Last name of the user'})
    lastName: string;

    @ApiProperty({type: String, description: 'Date of birth of the user'})
    dateOfBirth: string;

}

export class signUpDTO{
    @ApiProperty({type: Object, description: 'User that is to be created'})
    user: User;

}

export class loginDTO{
    @ApiProperty({type: String, description: 'email address of the user logging in'})
    username: string;

    @ApiProperty({type: String, description: 'title of exercises'})
    password: string

}

