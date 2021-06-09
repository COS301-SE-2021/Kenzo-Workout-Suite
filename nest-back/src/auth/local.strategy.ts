import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {UserService} from "./user.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private userService: UserService) {
        super(); // configuration
    }

    async validate(email: string, password:string): Promise<any>{
        await console.log("Hello, why arent you here?")
        const user= await this.userService.validateUser(email,password);

        if (!user){
            throw new UnauthorizedException("IT IS MESSING UP HERE");
        }

        return user;
    }
}