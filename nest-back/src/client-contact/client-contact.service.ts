import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { ActualPrisma, Context } from "../../context"
import {
  Contacts
} from "@prisma/client"
import { UserService } from "../User/user.service"
@Injectable()
export class ClientContactService {
  constructor (private userService: UserService) {
  }

  /**
   *Client Service - Create client contact
   *
   * @param contactEmail This is the email address of the client to be created
   * @param name This is the name of the client that is to be created
   * @param surname This is the surname of the client that is to be created
   * @param plannerID This is the id of the planner that is creating the client contact
   * @throws NotFoundException if:
   *                               -An empty email address is passed in.
   *                               -An empty name or surname is passed in.
   *                               -An empty plannerID is passed in.
   * @throws BadRequestException if:
   *                               -The server failed to create and add the contact to the db.
   * @return String to indicate the contact has been created.
   * @author Zelealem Tesema
   *
   */
  async createClientContact (contactEmail: string, name: string, surname: string, plannerID:string, ctx: Context) {
    if (contactEmail === "" || name === "" || surname === "" || plannerID === "" || contactEmail === null || name === null || surname === null || plannerID === null) {
      throw new NotFoundException("Parameters can not be left empty")
    }
    try {
      await ctx.prisma.contacts.create({
        data: {
          contactEmail: contactEmail,
          name: name,
          surname: surname,
          planner: {
            connect: {
              userID: plannerID
            }
          }
        }
      })

      return "Client contact created."
    } catch (e) {
      throw new BadRequestException("Could not create client contact")
    }
  }

  /**
   *Client Service - Update client contact
   *
   * @param contactEmail This is the email address of the client to be updated
   * @param name This is the name of the client that is to be updated
   * @param surname This is the surname of the client that is to be updated
   * @param plannerID This is the id of the planner that is updating the client contact
   * @throws NotFoundException if:
   *                               -An empty email address is passed in.
   *                               -An empty name or surname is passed in.
   *                               -An empty plannerID is passed in.
   * @throws BadRequestException if:
   *                               -The server failed to update the contact to the db.
   * @return String to indicate the contact has been updated.
   * @author Zelealem Tesema
   *
   */
  async updateClientContact (contactID: string, newContactEmail: string, newName: string, newSurname: string, plannerID:string, ctx: Context) {
    if (contactID === "" || newName === "" || newSurname === "" || plannerID === "" || contactID == null || newName === null || newSurname == null || plannerID == null) {
      throw new NotFoundException("Parameters can not be left empty!")
    }
    try {
      await ctx.prisma.contacts.update({
        where: {
          contactId: contactID
        },
        data: {
          contactEmail: newContactEmail,
          name: newName,
          surname: newSurname
        }
      })

      return "Client contact updated."
    } catch (e) {
      throw new BadRequestException("Could not update contact")
    }
  }

  /**
   *Client Service - Delete client contact
   *
   * @param contactID This is the unique ID of the client to be deleted
   * @throws NotFoundException if:
   *                               -An empty contactID is passed in.
   * @throws BadRequestException if:
   *                               -The server failed to delete the contact from the db.
   * @return String to indicate the contact has been deleted.
   * @author Zelealem Tesema
   *
   */
  async deleteClientContact (contactID: string, ctx: Context) {
    if (contactID === "" || contactID == null) {
      throw new NotFoundException("Parameters can not be left empty!")
    }

    try {
      await ctx.prisma.contacts.delete({
        where: {
          contactId: contactID
        }
      })
      return "Client contact deleted."
    } catch (e) {
      throw new BadRequestException("Could not delete contact")
    }
  }

  /**
   *Client Service - Get all the contacts for a specific Planner
   *
   * @param plannerID This is the unique ID of the planner to be searched under
   * @throws BadRequestException if:
   *                               -An empty plannerID is passed in
   *                               -No contacts could be found under this planner.
   * @return String to indicate the contact has been deleted.
   * @author Zelealem Tesema
   *
   */
  async getAllPlannersContacts (plannerID:string, ctx: Context) {
    if (plannerID == null || plannerID === "") {
      throw new BadRequestException("PlannerID field can not be left empty")
    }
    const clientContacts = await ctx.prisma.contacts.findMany({ // search for workouts that meet the requirement
      where: {
        plannerID: plannerID
      }
    })

    if (clientContacts == null) {
      throw new BadRequestException("No client contacts found.")
    } else {
      return clientContacts
    }
  }

  /**
   *Client Service - obtain a file in Base64
   *
   * @param path This is the path to a file in storage
   * @return Base64 base64 file
   * @author Zelealem Tesema
   *
   */
  async getFileInBase64 (path: String) {
    const fs = require("fs")
    const file = await fs.readFileSync(path).toString("base64")
    return file
  }

  /**
   *Client Service - Send PDF Email to Contact(s)
   *
   * @param contacts This is the an array of Contact objects to send PDF email(s) to
   * @param plannerID This is the ID of the planner that is sending the PDF email(s)
   * @param workoutID This is the ID of the workout that is being sent via email as a PDF
   * @throws NotFoundException if:
   *                               -An empty contactID is passed in.
   *                               -An empty plannerID is passed in.
   *                               -An empty workoutID is passed in.
   * @throws BadRequestException if:
   *                               -The server failed to send the email(s) with the PDF.
   * @return String to indicate the email has been sent.
   * @author Zelealem Tesema
   *
   */
  async sendPDFEmailToContact (contacts: Contacts[], plannerID:string, workoutID:string) {
    if (contacts == null || plannerID === "" || plannerID == null || workoutID === "" || workoutID == null) {
      throw new NotFoundException("Parameters can not be left empty")
    }

    const planner = await this.userService.findUserByUUID(plannerID, ActualPrisma())

    const sgMail = require("@sendgrid/mail")
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const workoutPDF = await this.getFileInBase64("./src/GeneratedWorkouts/" + workoutID + ".pdf")

    const kenzoImage = await this.getFileInBase64("./src/Assets/KenzoLogoAndBanners/KenzoEmailBanner.PNG")

    const personalizationsArray = [{
      to: contacts[0].contactEmail,
      subject: "Hey, " + contacts[0].name + " Your planner " + planner.firstName + " has created a new workout🏋️🏋️🏋️"
    }]

    for (let i = 1; i < contacts.length; i++) {
      const emailObject = {
        to: contacts[i].contactEmail,
        subject: "Hey, " + contacts[i].name + " Your planner " + planner.firstName + " has created a new workout🏋️🏋️🏋️"
      }
      personalizationsArray.push(emailObject)
    }

    const text = "Attached is the PDF document as well as the video of the workout plan that " + planner.firstName + " " + planner.lastName + " has decided to share with you"

    const msg = {
      from: "kenzo.workout.suite@gmail.com",
      text: "Attached is the PDF document as well as the video of the workout plan that " + planner.firstName + planner.lastName + " has decided to share with you",
      personalizations: personalizationsArray,
      attachments: [
        {
          content: workoutPDF,
          filename: "workoutPDF.pdf",
          type: "application/pdf",
          disposition: "attachment"
        },
        {
          filename: "image",
          type: "image/png",
          content_id: "Logo",
          content: kenzoImage,
          disposition: "inline"
        }
      ],
      html: "<h3>" + text + "</h3>"
    }

    try {
      await sgMail.send(msg)
      return "Email sent!"
    } catch (err) {
      throw new BadRequestException("Could not send email")
    }
  }

  /**
   *Client Service - Send video Email to Contact(s)
   *
   * @param contacts This is the an array of Contact objects to send video email(s) to
   * @param plannerID This is the ID of the planner that is sending the video email(s)
   * @param workoutID This is the ID of the workout that is being sent via email as a video
   * @throws NotFoundException if:
   *                               -An empty contactID is passed in.
   *                               -An empty plannerID is passed in.
   *                               -An empty workoutID is passed in.
   * @throws BadRequestException if:
   *                               -The server failed to send the email(s) with the video.
   * @return String to indicate the email has been sent.
   * @author Zelealem Tesema
   *
   */
  async sendVideoEmailToContact (contacts: Contacts[], plannerID:string, workoutID:string) {
    if (contacts == null || plannerID === "" || plannerID == null || workoutID === "" || workoutID == null) {
      throw new NotFoundException("Parameters can not be left empty")
    }

    const planner = await this.userService.findUserByUUID(plannerID, ActualPrisma())

    const sgMail = require("@sendgrid/mail")
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const workoutVideo = await this.getFileInBase64("./src/videoGeneration/Videos/" + workoutID + ".mp4")

    const kenzoImage = await this.getFileInBase64("./src/Assets/KenzoLogoAndBanners/KenzoEmailBanner.PNG")

    const personalizationsArray = [{
      to: contacts[0].contactEmail,
      subject: "Hey, " + contacts[0].name + " Your planner " + planner.firstName + " has created a new workout🏋️🏋️🏋️"
    }]

    for (let i = 1; i < contacts.length; i++) {
      const emailObject = {
        to: contacts[i].contactEmail,
        subject: "Hey, " + contacts[i].name + " Your planner " + planner.firstName + " has created a new workout🏋️🏋️🏋️"
      }
      personalizationsArray.push(emailObject)
    }

    const text = "Attached is the PDF document as well as the video of the workout plan that " + planner.firstName + " " + planner.lastName + " has decided to share with you"

    const msg = {
      from: "kenzo.workout.suite@gmail.com",
      text: "Attached is the PDF document as well as the video of the workout plan that " + planner.firstName + planner.lastName + " has decided to share with you",
      personalizations: personalizationsArray,
      attachments: [
        {
          content: workoutVideo,
          filename: "workout.mp4",
          type: "video/mp4",
          disposition: "attachment"
        },
        {
          filename: "image",
          type: "image/png",
          content_id: "Logo",
          content: kenzoImage,
          disposition: "inline"
        }
      ],
      html: "<h3>" + text + "</h3>"
    }

    try {
      await sgMail.send(msg)
      return "Email sent!"
    } catch (err) {
      throw new BadRequestException("Could not send email")
    }
  }

  /**
   *Client Service - Send Multimedia Email to Contact(s)
   *
   * @param contacts This is the an array of Contact objects to send multimedia email(s) to
   * @param plannerID This is the ID of the planner that is sending the multimedia email(s)
   * @param workoutID This is the ID of the workout that is being sent via email as multimedia
   * @throws NotFoundException if:
   *                               -An empty contactID is passed in.
   *                               -An empty plannerID is passed in.
   *                               -An empty workoutID is passed in.
   * @throws BadRequestException if:
   *                               -The server failed to send the email(s) with the video.
   * @return String to indicate the email has been sent.
   * @author Zelealem Tesema
   *
   */
  async sendMultimediaEmailToContact (contacts: Contacts[], plannerID:string, workoutID:string) {
    if (contacts == null || plannerID === "" || plannerID == null || workoutID === "" || workoutID == null) {
      throw new NotFoundException("Parameters can not be left empty")
    }

    const planner = await this.userService.findUserByUUID(plannerID, ActualPrisma())

    const sgMail = require("@sendgrid/mail")
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const workoutVideo = await this.getFileInBase64("./src/videoGeneration/Videos/" + workoutID + ".mp4")
    const workoutPDF = await this.getFileInBase64("./src/GeneratedWorkouts/" + workoutID + ".pdf")
    const kenzoImage = await this.getFileInBase64("./src/Assets/KenzoLogoAndBanners/KenzoEmailBanner.PNG")

    const personalizationsArray = [{
      to: contacts[0].contactEmail,
      subject: "Hey, " + contacts[0].name + " Your planner " + planner.firstName + " has created a new workout🏋️🏋️🏋️"
    }]

    for (let i = 1; i < contacts.length; i++) {
      const emailObject = {
        to: contacts[i].contactEmail,
        subject: "Hey, " + contacts[i].name + " Your planner " + planner.firstName + " has created a new workout🏋️🏋️🏋️"
      }
      personalizationsArray.push(emailObject)
    }

    const text = "Attached is the PDF document as well as the video of the workout plan that " + planner.firstName + " " + planner.lastName + " has decided to share with you"

    const msg = {
      from: "kenzo.workout.suite@gmail.com",
      text: "Attached is the PDF document as well as the video of the workout plan that " + planner.firstName + planner.lastName + " has decided to share with you",
      personalizations: personalizationsArray,
      attachments: [
        {
          content: workoutPDF,
          filename: "workoutPDF.pdf",
          type: "application/pdf",
          disposition: "attachment"
        },
        {
          content: workoutVideo,
          filename: "workout.mp4",
          type: "video/mp4",
          disposition: "attachment"
        },
        {
          filename: "image",
          type: "image/png",
          content_id: "Logo",
          content: kenzoImage,
          disposition: "inline"
        }
      ],
      html: "<h3>" + text + "</h3>"
    }

    try {
      await sgMail.send(msg)
      return "Email sent!"
    } catch (err) {
      throw new BadRequestException("Could not send email")
    }
  }
}
