import { Body, Controller, Delete, Get, Post, Put, Request, UseGuards } from "@nestjs/common"
import { ClientContactService } from "./client-contact.service"
import { ApiBadRequestResponse, ApiBody, ApiInternalServerErrorResponse, ApiOkResponse } from "@nestjs/swagger"
import { createContactDTO, deleteContactDTO, updateContactDTO } from "../Workout/workout.model"
import { JwtAuthGuard } from "../User/AuthGuards/jwt-auth.guard"
import { ActualPrisma, Context } from "../../context"

@Controller("client-contact")
export class ClientContactController {
  ctx: Context

  constructor (private readonly clientContactService:ClientContactService) {
    this.ctx = ActualPrisma()
  }

    @Get("email")
  testFunction (
  ) {
    return this.clientContactService.sendEmailToContact()
  }

  /**
   *Workout Controller - Create Client Contact
   *
   * @throws BadRequestException if:
   * @return Object array of all contact objects
   * @author Msi Sibanyoni & Tinashe Chamisa
   *
   */
  @Get("getAllClientContacts")
  @ApiOkResponse({
    description: "An array of client contact objects."
  })
  @ApiBadRequestResponse({
    description: "Could not retrieve client contact objects"
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error."
  })
    getAllClientContacts (
    ) {
      return this.clientContactService.getAllClientContacts(this.ctx)
    }

  /**
   *Workout Controller - Delete Client Contact
   *
   * @param contactEmail - Email to delete contact.
   * @throws BadRequestException if:
   * @return Message indicating success.
   *
   * @author Msi Sibanyoni & Tinashe Chamisa
   *
   */
  @Delete("deleteClientContact")
  @ApiOkResponse({
    description: "Client deleted."
  })
  @ApiBadRequestResponse({
    description: "Could not delete client."
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error."
  })
  @ApiBody({ type: deleteContactDTO })
  deleteClientContact (
      @Body("contactEmail") contactEmail: string
  ) {
    return this.clientContactService.deleteClientContact(contactEmail, this.ctx)
  }

  /**
   *Workout Controller - Create Client Contact
   *
   * @param contactEmail - Email to create contact.
   * @param name - Name to create contact.
   * @param surname - Surname to create contact.
   * @param req - Details of user who made request
   * @throws BadRequestException if:
   * @return Message indicating success.
   *
   * @author Msi Sibanyoni & Tinashe Chamisa
   *
   */
  @UseGuards(JwtAuthGuard)
  @Post("createClientContact")
  @ApiOkResponse({
    description: "Client Created."
  })
  @ApiBadRequestResponse({
    description: "Could not create client."
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error."
  })
  @ApiBody({ type: createContactDTO })
  createClientContact (
      @Body("contactEmail") contactEmail: string,
      @Body("name") name: string,
      @Body("surname") surname: string,
      @Request() req
  ) {
    return this.clientContactService.createClientContact(contactEmail, name, surname, req.user.userID, this.ctx)
  }

  /**
   *Workout Controller - Update Client Contact
   *
   * @param contactEmail - Email to update contact.
   * @param name - Name to update contact.
   * @param surname - Surname to update contact.
   * @throws BadRequestException if:
   * @return Message indicating success.
   *
   * @author Msi Sibanyoni & Tinashe Chamisa
   *
   */
  @UseGuards(JwtAuthGuard)
  @Put("updateClientContact")
  @ApiOkResponse({
    description: "Client updated."
  })
  @ApiBadRequestResponse({
    description: "Could not update client."
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error."
  })
  @ApiBody({ type: updateContactDTO })
  updateClientContact (
      @Body("contactEmail") contactEmail: string,
      @Body("name") name: string,
      @Body("surname") surname: string,
      @Request() req
  ) {
    return this.clientContactService.updateClientContact(contactEmail, name, surname, req.user.userID, this.ctx)
  }
}
