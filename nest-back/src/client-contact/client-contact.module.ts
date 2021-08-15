import { Module } from "@nestjs/common"
import { ClientContactController } from "./client-contact.controller"
import { PrismaService } from "../Prisma/prisma.service"
import { ClientContactService } from "./client-contact.service"
import { UserModule } from "../User/user.module"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"

@Module(
  {
    imports: [UserModule, PassportModule, JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRY_TIME }
    })],
    controllers: [ClientContactController],
    providers: [PrismaService, ClientContactService],
    exports: [ClientContactService]
  })

export class ClientContactModule {}
