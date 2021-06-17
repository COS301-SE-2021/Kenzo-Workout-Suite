import {Injectable} from "@nestjs/common";
import {UserService} from "../User/userService";

@Injectable()
export class AuthService
{
    constructor(
        private readonly userService: UserService,
    )
    {

    }
}