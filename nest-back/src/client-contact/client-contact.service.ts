import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { Context } from "../../context"
import { PrismaService } from "../Prisma/prisma.service"
import {
  Contacts
} from "@prisma/client"
@Injectable()
export class ClientContactService {
  constructor (private prisma: PrismaService) {

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

  async sendEmailToContact (contacts: Contacts[]) {
    const sgMail = require("@sendgrid/mail")
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const fs = require("fs")

    const pathToAttachment = "./src/Workout/GeneratedWorkouts/TestWorkout.pdf"
    const attachment = fs.readFileSync(pathToAttachment).toString("base64")

    const personalizationsArray = [{
      to: contacts[0].contactEmail,
      text: "Hey, " + contacts[0].name + "Your planner " + "has created a new workout and shared it with you. ENJOY!!"
    }]

    for (let i = 1; i < contacts.length; i++) {
      const emailObject = {
        to: contacts[i].contactEmail,
        text: "Hey, " + contacts[i].name + "Your planner " + "has created a new workout and shared it with you. ENJOY!!"
      }
      personalizationsArray.push(emailObject)
    }

    const msg = {
      personalizations: personalizationsArray,
      from: "kenzo.workout.suite@gmail.com",
      subject: "I miss Luca",
      text: "Hey, here is a new workout program for you!",
      attachments: [
        {
          content: attachment,
          filename: "attachment.pdf",
          type: "application/pdf",
          disposition: "attachment"
        }
      ]
    }

    try {
      await sgMail.send(msg)
      return "Email sent!"
    } catch (err) {
      throw new BadRequestException("Could not send email")
    }
  }
}
