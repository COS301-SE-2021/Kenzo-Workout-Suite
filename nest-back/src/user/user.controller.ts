import {Body, Controller, Get, Post, Put, UseGuards, Request, Req, HttpCode} from '@nestjs/common';
import {UserService} from "./user.service";
import { AuthGuard } from '@nestjs/passport';
import {LocalAuthGuard} from "./local-auth.guard";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {User} from "@prisma/client";
import {ActualPrisma} from "../../context";
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
     *User Controller- login
     *
     * @param req This is the request that has the Authorisation bearer token.
     *
     * @throws NotFoundException if:
     *                          -An empty user object is passed into the function
     *                          -A user object without the field 'userId' is passed into the function
     *
     * @return Promise that consists of the access token
     * @author Zelealem Tesema
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

    /**
     * User Controller- googleLogin
     *
     * @param req
     *
     * @author Zelealem Tesema
     * @callback googleAuthRedirect The function will callback to the googleredirect functionality
     */
    @Get('googleLogin')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}

    /**
     * User Controller- googleRedirect
     *
     * @param req
     *
     * @author Zelealem Tesema
     */
    @Get('googleRedirect')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req) {
        return this.userService.googleLogin(req)
    }


    /**
     * User Controller- getUserDetails
     *
     * @param req This consists of the userID of the user whose details are being resolved.
     *
     * @throws BadRequestException if:
     *                             -An empty or null user ID is passed into the function
     *                             -The database fails to retrieve the user details
     *
     *@throws NotFoundException if:
     *                          -No user with such UUID exists.
     * @author Zelealem Tesema
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('getUserDetails')
    @ApiOkResponse({
        description: 'Login successful.'
    })
    @ApiNotFoundResponse({
        description: 'Invalid Email or Password'
    })
    @HttpCode(200)
    getUserData(@Request() req){
        return this.userService.findUserByUUID(req.user.userId,ActualPrisma())
    }


    /**
     * User Controller- updateUserDetail
     *
     * @param req   This is the request object that consists of the UUID of the user whose details need to be updated
     * @param firstName This is the first name of the user whose details need to be updated.
     * @param lastName  This is the last name of the user whose details need to be updated.
     * @param dateOfBirth This is the updated date of birth of the user whose details need to be updated.
     *
     * @throws BadRequestException if:
     *                          -Null values are passed in for the firstName, LastName or userID
     *                          -Empty values are passed in for the firstName, LastName or userID
     *                          -The user details could not be updated
     *
     * @author Zelealem Tesema
     *
     */
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