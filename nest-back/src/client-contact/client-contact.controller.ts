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

  /**
   * client-contact Controller - sendEmailToContacts
   * @param emails
   * @throws BadRequestException if the email could not be sent by the service provider (Twillio)
   * @return "Email sent!" if the email successfully sent
   * @author Zelealem Tesema
   */
  @UseGuards(JwtAuthGuard)
    @Get("sendEmailsToContacts")
  sendEmailsToContacts (
      @Body("emails") emails: string[]
  ) {
    return this.clientContactService.sendEmailToContact(emails)
  }

  /**
   *client-contact Controller - CreateClientContact
   *
   * @throws BadRequestException if:
   * @return Object array of all contact objects
   * @author Msi Sibanyoni & Tinashe Chamisa
   *
   */
  @UseGuards(JwtAuthGuard)
  @Post("createClientContact")
  @ApiOkResponse({
    description: "An array of client contact objects."
  })
  @ApiBadRequestResponse({
    description: "Could not retrieve client contact objects"
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error."
  })
  createClientContact (
        @Body("contactEmail") contactEmail:string,
        @Body("name") name:string,
        @Body("surname") surname:string,
        @Request() req

  ) {
    return this.clientContactService.createClientContact(contactEmail, name, surname, req.user.userID, this.ctx)
  }

  /**
   * client-contact Controller - getAllPlannersContacts
   *
   * @throws BadRequestException if:
   * @return Object array of all contact objects
   * @author Msi Sibanyoni & Tinashe Chamisa
   *
   */
  @UseGuards(JwtAuthGuard)
  @Post("getAllPlannersContacts")
  getAllPlannersContacts (
      @Request() req
  ) {
    return this.clientContactService.getAllPlannersContacts(req.user.userID, this.ctx)
  }

  /**
   *Workout Controller - UpdateClientContact
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
      @Body("contactID") contactID: string,
      @Body("email") email: string,
      @Body("name") name: string,
      @Body("surname") surname: string,
      @Request() req
  ) {
    return this.clientContactService.updateClientContact(contactID, email, name, surname, req.user.userID, this.ctx)
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
  @UseGuards(JwtAuthGuard)
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
      @Body("contactID") contactID: string
  ) {
    return this.clientContactService.deleteClientContact(contactID, this.ctx)
  }
}
