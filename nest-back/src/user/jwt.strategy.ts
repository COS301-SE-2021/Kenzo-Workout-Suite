import {PassportStrategy} from "@nestjs/passport";
import {Injectable} from "@nestjs/common";
import {jwtConstants} from "./constants";
import {ExtractJwt, Strategy} from "passport-jwt";




@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey: jwtConstants.secret //TODO PUT THIS INTO ENV
        });
    }

    async validate(payload: any){

        // return the specific current user within this return so that other request can use it
        return {
            email:payload.email
        };
    }
}