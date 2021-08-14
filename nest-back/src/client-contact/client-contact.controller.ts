import { Controller, Get } from "@nestjs/common"
import { ClientContactService } from "./client-contact.service"

@Controller("client-contact")
export class ClientContactController {
  constructor (private readonly clientContactService:ClientContactService) {
  }

    @Get("test")
  testFunction (
  ) {
    return this.clientContactService.doSomething()
  }
}
