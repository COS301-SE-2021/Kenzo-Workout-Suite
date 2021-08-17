import { Body, Controller, Delete, Get, Post, Put, Request, UseGuards } from "@nestjs/common"
import { ClientContactService } from "./client-contact.service"
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse
} from "@nestjs/swagger"
import { JwtAuthGuard } from "../User/AuthGuards/jwt-auth.guard"
import { ActualPrisma, Context } from "../../context"
import { createContactDTO, deleteContactDTO, updateContactDTO } from "./client-contact.model"
import {
  Contacts
} from "@prisma/client"
@Controller("client-contact")
export class ClientContactController {
  ctx: Context

  constructor (private readonly clientContactService:ClientContactService) {
    this.ctx = ActualPrisma()
  }

  /**
   * client-contact Controller - sendEmailToContacts
   * @throws BadRequestException if the email could not be sent by the service provider (Twillio)
   * @return "Email sent!" if the email successfully sent
   * @author Zelealem Tesema
   * @param contacts
   * @param req
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("sendEmailsPDFToContacts")
  sendEmailsPDFToContacts (
      @Body("contacts") contacts: Contacts[],
      @Body("workoutID") workoutID:string,
      @Request() req
  ) {
    return this.clientContactService.sendPDFEmailToContact(contacts, req.user.userID, workoutID)
  }

  /**
   * client-contact Controller - sendEmailsToAllContacts
   * @throws BadRequestException if the email could not be sent by the service provider (Twillio)
   * @return "Email sent!" if the email successfully sent
   * @author Zelealem Tesema
   * @param contacts
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("sendEmailsPDFToAllContacts")
  async sendEmailsPDFToAllContacts (
      @Request() req,
      @Body("workoutID") workoutID:string
  ) {
    const contacts = await this.clientContactService.getAllPlannersContacts(req.user.userID, this.ctx)
    return this.clientContactService.sendPDFEmailToContact(contacts, req.user.userID, workoutID)
  }

  /**
   * client-contact Controller - sendEmailToContacts
   * @throws BadRequestException if the email could not be sent by the service provider (Twillio)
   * @return "Email sent!" if the email successfully sent
   * @author Zelealem Tesema
   * @param contacts
   * @param req
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("sendEmailsVideoToContacts")
  sendEmailsVideoToContacts (
      @Body("contacts") contacts: Contacts[],
      @Body("workoutID") workoutID:string,
      @Request() req
  ) {
    return this.clientContactService.sendVideoEmailToContact(contacts, req.user.userID, workoutID)
  }

  /**
   * client-contact Controller - sendEmailsToAllContacts
   * @throws BadRequestException if the email could not be sent by the service provider (Twillio)
   * @return "Email sent!" if the email successfully sent
   * @author Zelealem Tesema
   * @param contacts
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("sendEmailsVideoToAllContacts")
  async sendEmailsVideoToAllContacts (
      @Request() req,
      @Body("workoutID") workoutID:string
  ) {
    const contacts = await this.clientContactService.getAllPlannersContacts(req.user.userID, this.ctx)
    return this.clientContactService.sendVideoEmailToContact(contacts, req.user.userID, workoutID)
  }

  /**
   * client-contact Controller - sendEmailToContacts
   * @throws BadRequestException if the email could not be sent by the service provider (Twillio)
   * @return "Email sent!" if the email successfully sent
   * @author Zelealem Tesema
   * @param contacts
   * @param req
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("sendEmailsMultimediaToContacts")
  sendEmailsMultimediaToContacts (
      @Body("contacts") contacts: Contacts[],
      @Body("workoutID") workoutID:string,
      @Request() req
  ) {
    return this.clientContactService.sendMultimediaEmailToContact(contacts, req.user.userID, workoutID)
  }

  /**
   * client-contact Controller - sendEmailsToAllContacts
   * @throws BadRequestException if the email could not be sent by the service provider (Twillio)
   * @return "Email sent!" if the email successfully sent
   * @author Zelealem Tesema
   * @param contacts
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("sendEmailsMultimediaToAllContacts")
  async sendEmailsMultimediaToAllContacts (
      @Request() req,
      @Body("workoutID") workoutID:string
  ) {
    const contacts = await this.clientContactService.getAllPlannersContacts(req.user.userID, this.ctx)
    return this.clientContactService.sendMultimediaEmailToContact(contacts, req.user.userID, workoutID)
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
  @ApiBearerAuth()
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
  @ApiBody({ type: createContactDTO })
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
  @ApiBearerAuth()
  @Get("getAllPlannersContacts")
  getAllPlannersContacts (
      @Request() req
  ) {
    return this.clientContactService.getAllPlannersContacts(req.user.userID, this.ctx)
  }

  /**
   *Workout Controller - UpdateClientContact
   *
   * @param contactID - ContactID that needs to be updated
   * @param email - Email address that needs to be updated to.
   * @param name - Name to update contact.
   * @param surname - Surname to update contact.
   * @param req
   * @throws BadRequestException if:
   * @return Message indicating success.
   *
   * @author Msi Sibanyoni & Tinashe Chamisa
   *
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
   * @throws BadRequestException if:
   * @return Message indicating success.
   *
   * @author Msi Sibanyoni & Tinashe Chamisa
   *
   * @param contactID
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
