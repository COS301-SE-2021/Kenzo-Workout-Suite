import { Module } from "@nestjs/common"
import { WorkoutController } from "./workout.controller"
import { WorkoutService } from "./workout.service"
import { PrismaService } from "../Prisma/prisma.service"
import { UserModule } from "../User/user.module"
import { UserService } from "../User/user.service"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { LocalStrategy } from "../User/PassportStrategies/local.strategy"
import { JwtStrategy } from "../User/PassportStrategies/jwt.strategy"
import { GoogleStrategy } from "../User/PassportStrategies/google.strategy"

@Module(
  {
    imports: [UserModule, PassportModule, JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRY_TIME }
    })],
    controllers: [WorkoutController],
    providers: [WorkoutService, PrismaService, UserService, LocalStrategy, JwtStrategy, GoogleStrategy],
    exports: [WorkoutService]
  }
)

// testing
export class WorkoutModule {}
