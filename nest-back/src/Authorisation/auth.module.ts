import {Module} from "@nestjs/common";
import {AuthService} from "../../dist/auth/auth.service";


@Module({
    providers: [AuthService]
})

export class AuthModule {}