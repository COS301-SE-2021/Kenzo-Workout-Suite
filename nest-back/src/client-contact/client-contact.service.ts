import { Injectable } from "@nestjs/common"

@Injectable()
export class ClientContactService {
  constructor () {}

  async doSomething () {
    return "HI I AM THE ONE"
  }
}
