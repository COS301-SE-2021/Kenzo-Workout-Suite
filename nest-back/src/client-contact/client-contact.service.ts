import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { ActualPrisma, Context } from "../../context"
import { PrismaService } from "../Prisma/prisma.service"
import {
  Contacts
} from "@prisma/client"
import { UserService } from "../User/user.service"
import { WorkoutService } from "../Workout/workout.service"
@Injectable()
export class ClientContactService {
  constructor (private prisma: PrismaService, private userService: UserService, private workoutService:WorkoutService) {

  }

  async createClientContact (contactEmail: string, name: string, surname: string, plannerID:string, ctx: Context) {
    if (contactEmail === "" || name === "" || surname === "" || contactEmail == null || name === null || surname == null) {
      throw new NotFoundException("Parameters can not be left empty!")
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
      throw new BadRequestException(e)
    }
  }

  async updateClientContact (contactID: string, newContactEmail: string, newName: string, newSurname: string, plannerID:string, ctx: Context) {
    if (contactID === "" || newName === "" || newSurname === "" || contactID == null || newName === null || newSurname == null) {
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
      throw new BadRequestException(e)
    }
  }

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
      throw new BadRequestException(e)
    }
  }

  async getAllPlannersContacts (plannerID:string, ctx: Context) {
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

  async sendEmailToContact (contacts: Contacts[], plannerID:string, workoutID:string) {
    const planner = await this.userService.findUserByUUID(plannerID, ActualPrisma())

    const sgMail = require("@sendgrid/mail")
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const fs = require("fs")

    const workoutPDF = await this.workoutService.getWorkoutPDF(workoutID, ActualPrisma())

    const kenzoImage = fs.readFileSync("./src/Assets/KenzoLogoAndBanners/KenzoEmailBanner.PNG").toString("base64")

    const personalizationsArray = [{
      to: contacts[0].contactEmail,
      subject: "Hey, " + contacts[0].name + " Your planner " + planner.firstName + " has created a new workout"
    }]

    for (let i = 1; i < contacts.length; i++) {
      const emailObject = {
        to: contacts[i].contactEmail,
        subject: "Hey, " + contacts[i].name + " Your planner " + planner.firstName + " has created a new workout"
      }
      personalizationsArray.push(emailObject)
    }

    const text = "Attatched is the PDF document as well as the video of the workout plan that " + planner.firstName + " " + planner.lastName + " has decided to share with you"

    const msg = {
      from: "kenzo.workout.suite@gmail.com",
      text: "Attatched is the PDF document as well as the video of the workout plan that " + planner.firstName + planner.lastName + " has decided to share with you",
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
}