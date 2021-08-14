import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { Context } from "../../context"
import { PrismaService } from "../Prisma/prisma.service"

@Injectable()
export class ClientContactService {
  constructor (private prisma: PrismaService) {

  }

  // async createClientContact (contactEmail: string, name: string, surname: string, plannerID:string, ctx: Context) {
  //   if (contactEmail === "" || name === "" || surname === "" || contactEmail == null || name === null || surname == null) {
  //     throw new NotFoundException("Parameters can not be left empty!")
  //   }
  //   try {
  //     await ctx.prisma.contacts.create({
  //       data: {
  //         contactEmail: contactEmail,
  //         name: name,
  //         surname: surname,
  //         planner: {
  //           connect: {
  //             userID: plannerID
  //           }
  //         }
  //       }
  //     })
  //     return "Client contact created."
  //   } catch (e) {
  //     throw new BadRequestException(e)
  //   }
  // }
  //
  // async updateClientContact (contactEmail: string, newContactEmail: string, newName: string, newSurname: string, plannerID:string, ctx: Context) {
  //   if (contactEmail === "" || newName === "" || newSurname === "" || contactEmail == null || newName === null || newSurname == null) {
  //     throw new NotFoundException("Parameters can not be left empty!")
  //   }
  //   try {
  //     await ctx.prisma.contacts.update({
  //       where: {
  //         contactEmail: contactEmail
  //       },
  //       data: {
  //         contactEmail: newContactEmail,
  //         name: newName,
  //         surname: newSurname,
  //         planner: {
  //           connect: {
  //             userID: plannerID
  //           }
  //         }
  //       }
  //     })
  //     return "Client contact updated."
  //   } catch (e) {
  //     throw new BadRequestException(e)
  //   }
  // }
  //
  // async deleteClientContact (contactEmail: string, plannerID:String, ctx: Context) {
  //   if (contactEmail === "" || contactEmail == null) {
  //     throw new NotFoundException("Parameters can not be left empty!")
  //   }
  //   try {
  //     await ctx.prisma.contacts.update({
  //       where: {
  //         contactEmail: contactEmail
  //       },
  //       data: {
  //         planners: {
  //           disconnect: {
  //             userID: plannerID
  //           }
  //         }
  //       }
  //     })
  //     return "Client contact deleted."
  //   } catch (e) {
  //     throw new BadRequestException(e)
  //   }
  // }
  //
  // async getClientContactDetails (contactEmail: string, ctx: Context) {
  //   const clientContacts = await ctx.prisma.contacts.findUnique({ // search for workouts that meet the requirement
  //     where: {
  //       contactEmail: contactEmail
  //     },
  //     select: {
  //       contactEmail: true,
  //       name: true,
  //       surname: true
  //     }
  //   })
  //   if (clientContacts == null) {
  //     throw new BadRequestException("No client contact with that email found.")
  //   } else {
  //     return clientContacts
  //   }
  // }
  //
  // async getAllClientContacts (ctx: Context) {
  //   const clientContacts = await ctx.prisma.contacts.findMany({ // search for workouts that meet the requirement
  //     select: {
  //       contactEmail: true,
  //       name: true,
  //       surname: true
  //     }
  //   })
  //   if (clientContacts == null) {
  //     throw new BadRequestException("No client contacts found.")
  //   } else {
  //     return clientContacts
  //   }
  // }

  async sendEmailToContact () {
    const sgMail = require("@sendgrid/mail")
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: "zelutesema@gmail.com",
      from: "crackedstudios.up@gmail.com",
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>"
    }
    sgMail.send(msg)
  }
}
