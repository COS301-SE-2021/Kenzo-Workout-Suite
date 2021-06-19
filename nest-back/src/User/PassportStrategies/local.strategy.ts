import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user.service';
import {ActualPrisma} from "../../../context";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super();
    }

    async validate(email: string, password: string): Promise<any> {

        const user = await this.userService.validateUser(email, password,ActualPrisma());
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }


}