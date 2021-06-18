import {Body, Controller, Get, Post, Put, UseGuards, Request, Req, HttpCode} from '@nestjs/common';
import {UserService} from "./user.service";
import { AuthGuard } from '@nestjs/passport';
import {LocalAuthGuard} from "./local-auth.guard";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {User} from "@prisma/client";
import {ActualPrisma} from "../../context";
import {v4 as uuidv4 } from 'uuid';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody, ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse, ApiPreconditionFailedResponse, ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {loginDTO, signUpDTO, updateUserDTO} from "./user.model";


@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {
    }

    /**
     * User Controller- signUp
     *
     * @param user User that is to be signed up
     *
     * @throws PreconditionFailedException if:
     *                          -Empty/null user object is passed into the function
     *                          -Email address that does not conform to the email address standard is passed in
     *                          -Password that does not conform to the password standard is passed in (atleast 8 characters consisting of one lower case, one upper case, one number and one special character)
     *
     *@throws BadRequestException if:
     *                          -A user with the passed in Users email already exists in the database.
     *
     * @return Promise This promise consists the JWT access token
     * @author Zelealem Tesema
     *
     */

    @Post('signUp')
    @ApiCreatedResponse({
        description: 'User has been successfully created.'
    })
    @ApiBadRequestResponse({
        description: 'User with this email already exists.'
    })
    @ApiPreconditionFailedResponse({
        description: 'Invalid email address or password.'
    })
    @ApiInternalServerErrorResponse({
        description: 'Could not create user due to server.'
    })
    @ApiBody({
        type:signUpDTO
    })
    signUpUser(
        @Body('user') user: User,
    ) {
        return this.userService.signUp(user,ActualPrisma());
    }


    /**
     *
     * @param req
     */
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOkResponse({
        description: 'Login successful.'
    })
    @ApiNotFoundResponse({
        description: 'Invalid Email or Password'
    })
    @ApiBody({
        type: loginDTO
    })
    @HttpCode(200)
    async login(@Request() req) {
        return this.userService.login(req.user);
    }


    @Get('googleLogin')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}

    @Get('googleRedirect')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req) {
        return this.userService.googleLogin(req)
    }


    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('getUserDetails')
    @ApiOkResponse({
        description: 'Login successful.'
    })
    @ApiNotFoundResponse({
        description: 'Invalid Email or Password'
    })
    @ApiBody({
        type: loginDTO
    })
    @HttpCode(200)
    getUserData(@Request() req){
        return this.userService.findUserByUUID(req.user.userId,ActualPrisma())
    }


    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put('updateUserDetail')
    @ApiOkResponse({
        description: 'User details successfully retrieved'
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized user'
    })
    @ApiBody({
        type:updateUserDTO
    })
    @ApiInternalServerErrorResponse({
        description: 'Could not create user due to server.'
    })
    updateUserDetail(@Request() req,
                     @Body('firstName') firstName: string,
                     @Body('lastName') lastName: string,
                     @Body('dateOfBirth') dateOfBirth: Date){
        return this.userService.updateUserDetails(firstName,lastName,dateOfBirth,req.user.userId,ActualPrisma())
    }
}