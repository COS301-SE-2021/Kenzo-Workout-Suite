import {
  BadRequestException, ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException, PreconditionFailedException
} from "@nestjs/common"
import { Context } from "../../context"

import {
  Workout,
  Exercise,
  Tag
} from "@prisma/client"
import { jsPDF } from "jspdf"
import { PrismaService } from "../Prisma/prisma.service"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import * as fs from "fs"
import { UserService } from "../User/user.service"

const Filter = require("bad-words"); const filter = new Filter()
const videoshow = require("videoshow")
const baseImages = require("../Workout/createdWorkoutImages.json")

@Injectable()
export class WorkoutService {
  constructor (private prisma: PrismaService, private userService: UserService) {
  }

  /**
     *Workout service - format
     *
     * @brief Function that formats a string so that every first letter of every word is a capital, eg: CoRE extreme to Core Extreme.
     * @param label This is the label that will be formatted.
     * @return  Re-formatted string.
     * @author Tinashe Chamisa
     *
     */
  format (label: string): string {
    let str = label.toLowerCase()
    const arr = str.split(" ")
    // loop through each element of the array and capitalize the first letter.
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
    }
    // Join all the elements of the array back into a string using a blank space as a separator
    str = arr.join(" ")
    return str
  }

  /**
     *Workout Service - Get Workouts
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No workouts were found in the database.
     * @return  Promise array of workout object/s.
     * @author Tinashe Chamisa
     *
     */
  async getWorkouts (ctx: Context): Promise<any> {
    try {
      const workouts = await ctx.prisma.workout.findMany({ // search for workouts that meet the requirement
        select: {
          workoutID: true,
          workoutTitle: true,
          workoutDescription: true,
          exercises: true,
          plannerID: true
        }
      })

      if (!(Array.isArray(workouts) && workouts.length)) { // if JSON object is empty, send error code
        throw new NotFoundException("No workouts were found in the database.")
      } else {
        return workouts
      }
    } catch (err) {
      throw new BadRequestException(err, "Could not fulfill request.")
    }
  }

  /**
     *Workout Service - Get Workouts by ID
     *
     * @param id This is the ID of the workout to be found in the database.
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No workouts were found in the database with the specified ID.
     * @return  Promise array of workout object/s.
     * @author Tinashe Chamisa
     *
     */
  async getWorkoutById (id: string, ctx: Context): Promise<any> {
    // eslint-disable-next-line no-useless-catch
    try {
      const workout = await ctx.prisma.workout.findUnique({ // search for workouts that meet the requirement
        where: {
          workoutID: id
        },
        select: {
          workoutID: true,
          workoutTitle: true,
          workoutDescription: true,
          exercises: true,
          plannerID: true
        }
      })
      if (!workout) { // if JSON object is empty, send error code
        throw new NotFoundException("No workouts were found in the database with the specified id.")
      } else {
        return workout
      }
    } catch (err) {
      throw err
    }
  }

  /**
     *Workout Service - Get Exercises
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No exercises were found in the database.
     * @return  Promise array of exercise object/s.
     * @author Tinashe Chamisa
     *
     */
  async getExercises (ctx: Context): Promise<any> {
    try {
      const exercises = await ctx.prisma.exercise.findMany({ // search for exercises that meet the requirement
        select: {
          exerciseID: true,
          exerciseTitle: true,
          exerciseDescription: true,
          repRange: true,
          sets: true,
          poseDescription: true,
          restPeriod: true,
          tags: true,
          duration: true
        }
      })

      if (!(Array.isArray(exercises) && exercises.length)) { // if JSON object is empty, send error code
        throw new NotFoundException("No exercises were found in the database.")
      }

      return exercises
    } catch (err) {
      throw new BadRequestException(err, "Could not fulfill request.")
    }
  }

  /**
     *Workout Service - Get Exercises by Title
     *
     * @param title This is the title of the exercise/s to be found in the database.
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No exercises were found in the database with the specified title.
     * @return  Promise array of exercises object/s.
     * @author Tinashe Chamisa
     *
     */
  async getExerciseByTitle (title: string, ctx: Context): Promise<any> {
    try {
      const exercise = await ctx.prisma.exercise.findMany({ // search for exercises that meet the requirement
        where: {
          exerciseTitle: title
        },
        select: {
          exerciseID: true,
          exerciseTitle: true,
          exerciseDescription: true,
          repRange: true,
          sets: true,
          poseDescription: true,
          restPeriod: true,
          tags: true,
          duration: true
        }
      })

      if (!(Array.isArray(exercise) && exercise.length)) { // if JSON object is empty, send error code
        throw new NotFoundException("No exercises were found in the database with the specified title.")
      } else {
        return exercise
      }
    } catch (err) {
      throw new BadRequestException(err, "Could not fulfill request.")
    }
  }

  /**
     *Workout Service - Get Exercises by ID
     *
     * @param id This is the id of the workout to be searched
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No exercises were found in the database with the specified title.
     * @return  Promise searched for exercise is returned.
     * @author Msi Sibanyoni
     *
     */
  async getExerciseByID (id: string, ctx: Context): Promise<any> {
    try {
      const exercise = await ctx.prisma.exercise.findUnique({ // search for exercises that meet the requirement
        where: {
          exerciseID: id
        },
        select: {
          exerciseID: true,
          exerciseTitle: true,
          exerciseDescription: true,
          repRange: true,
          sets: true,
          poseDescription: true,
          restPeriod: true,
          tags: true,
          duration: true
        }
      })
      if (exercise == null) { // if JSON object is empty, send error code
        throw new NotFoundException("No exercise was found in the database with the specified ID.")
      } else {
        return exercise
      }
    } catch (err) {
      throw new BadRequestException(err, "Could not fulfill request.")
    }
  }

  /**
     *Workout Service - Get Workouts by Planner
     *
     * @param id This is the ID of the planner of the workout/s to be found in the database.
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No workouts were found in the database with the specified planner ID.
     * @return  Promise array of workout object/s.
     * @author Tinashe Chamisa
     *
     */
  async getWorkoutByPlanner (id: string, ctx: Context): Promise<any> {
    try {
      const workouts = await ctx.prisma.workout.findMany({ // search for workouts that meet the requirement
        where: {
          plannerID: id
        },
        select: {
          workoutID: true,
          workoutTitle: true,
          workoutDescription: true,
          exercises: true,
          plannerID: true
        }
      })
      if (!(Array.isArray(workouts) && workouts.length)) { // if JSON object is empty, send error code
        throw new NotFoundException("No workouts were found in the database with the specified planner.")
      } else {
        return workouts
      }
    } catch (err) {
      throw new BadRequestException(err, "Could not fulfill request.")
    }
  }

  /**
     *Workout Service - Get Exercises by Planner
     *
     * @param id This is the ID of the planner of the workout/s to be found in the database.
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No workouts were found in the database with the specified planner ID.
     * @return  Promise array of workout object/s.
     * @author Msi Sibanyoni
     *
     */
  async getExercisesByPlanner (id: string, ctx: Context): Promise<any> {
    try {
      const exercise = await ctx.prisma.exercise.findMany({ // search for workouts that meet the requirement
        where: {
          plannerID: id
        },
        select: {
          exerciseID: true,
          exerciseTitle: true,
          exerciseDescription: true,
          repRange: true,
          sets: true,
          poseDescription: true,
          restPeriod: true,
          tags: true,
          duration: true,
          plannerID: true
        }
      })
      if (!(Array.isArray(exercise) && exercise.length)) { // if JSON object is empty, send error code
        throw new NotFoundException("No Exercises were found in the database with the specified planner.")
      } else {
        return exercise
      }
    } catch (err) {
      throw new BadRequestException(err, "Could not fulfill request.")
    }
  }

  /**
     *Workout Service - Create Exercise
     *
     * @param title This is the title of the exercise.
     * @param description This is the description of the exercise.
     * @param repRange This is the amount of reps.
     * @param sets This is the amount of sets.
     * @param poseDescription This is the description of the poses
     * @param restPeriod This is the rest period of the exercise.
     * @param tags this is an array of tags
     * @param duration This is the duration of the exercise.
     * @param plannerID This is the planner ID
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws PreconditionFailedException if:
     *                               -Not all parameters are given.
     * @throws NotFoundException if:
     *                               -An exercise with provided ID does not exist.
     * @return  Message indicating success.
     * @author Msi Sibanyoni
     *
     */
  async createExercise (title:string, description:string, repRange:string, sets:number, poseDescription:string, restPeriod:number, tags:Tag[], duration:number, plannerID:string, ctx: Context) {
    if (title === "" || description === "" || poseDescription === "" || tags == null || plannerID === "" || title == null || description == null || repRange == null || sets == null || poseDescription == null || restPeriod == null || duration == null) {
      throw new NotFoundException("Parameters can not be left empty!")
    }

    if (Array.isArray(tags) && tags.length) {
      await this.addNewTags(tags, ctx)
      const tagConnection = tags.map(n => {
        const container = {
          label: n.label
        }

        return container
      })
      await ctx.prisma.exercise.create({
        data: {
          exerciseTitle: title,
          exerciseDescription: description,
          repRange: repRange,
          sets: sets,
          poseDescription: poseDescription,
          restPeriod: restPeriod,
          duration: duration,
          tags: {
            connect: tagConnection
          },
          planner: {
            connect: {
              userID: plannerID
            }
          }
        }
      })
      return ("Exercise created.")
    } else {
      await ctx.prisma.exercise.create({
        data: {
          exerciseTitle: title,
          exerciseDescription: description,
          repRange: repRange,
          sets: sets,
          poseDescription: poseDescription,
          restPeriod: restPeriod,
          duration: duration,
          planner: {
            connect: {
              userID: plannerID
            }
          }
        }
      })
      return ("Exercise created.")
    }
  }

  /**
     *Workout Service - Update Exercise
     *
     * @param exercise This is the ID of the exercise.
     * @param title This is the title of the exercise.
     * @param description This is the description of the exercise.
     * @param repRange This is the amount of reps.
     * @param sets This is the amount of sets.
     * @param Posedescription This is the pose description.
     * @param restPeriod This is the rest period of the exercise.
     * @param difficulty This is the difficulty of the exercise.
     * @param duration This is the duration of the exercise.
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws PreconditionFailedException if:
     *                               -Not all parameters are given.
     * @throws NotFoundException if:
     *                               -An exercise with provided ID does not exist.
     * @return  Message indicating success.
     * @author Tinashe Chamisa
     *
     */
  async updateExercise (exercise: string, title: string, description: string, repRange: string, sets: number, Posedescription: string, restPeriod: number, tags: Tag[], duratime: number, plannerID:string, ctx: Context): Promise<any> {
    if (exercise === "" || title === "" || description === "" || Posedescription === "" || tags == null || plannerID === "" || title == null || description == null || repRange == null || sets == null || Posedescription == null || restPeriod == null || duratime == null || plannerID === "") {
      throw new PreconditionFailedException("Invalid exercise object passed in.")
    }

    try {
      const Exercise = await ctx.prisma.exercise.findMany({
        where: {
          exerciseID: exercise
        },
        select: {
          exerciseID: true
        }
      })

      if (!(Array.isArray(Exercise) && Exercise.length)) {
        throw new NotFoundException("Exercise with provided ID does not exist.")
      }
      if ((Array.isArray(tags) && tags.length)) { // run update query with tags
        await this.addNewTags(tags, ctx)
        const tagConnection = tags.map(n => {
          const container = {
            label: n.label
          }

          return container
        })
        await ctx.prisma.exercise.update({
          where: {
            exerciseID: exercise
          },
          data: {
            exerciseID: exercise,
            exerciseTitle: title,
            exerciseDescription: description,
            repRange: repRange,
            sets: sets,
            poseDescription: Posedescription,
            restPeriod: restPeriod,
            tags: {
              connect: tagConnection
            },
            duration: duratime,
            planner: {
              connect: {
                userID: plannerID
              }
            }
          }
        })

        return "Exercise updated."
      } else {
        await ctx.prisma.exercise.update({
          where: {
            exerciseID: exercise
          },
          data: {
            exerciseID: exercise,
            exerciseTitle: title,
            exerciseDescription: description,
            repRange: repRange,
            sets: sets,
            poseDescription: Posedescription,
            restPeriod: restPeriod,
            duration: duratime,
            planner: {
              connect: {
                userID: plannerID
              }
            }
          }
        })
        return "Exercise updated."
      }
    } catch (err) {
      throw new BadRequestException(err, "Could not fulfill request.")
    }
  }

  /**
     *Workout Service - Delete Exercise
     *
     * @param exercise This is the ID of the exercise.
     * @param ctx
     * @throws PreconditionFailedException if:
     *                               -Parameter can not be left empty.
     * @throws NotFoundException if:
     *                               -An exercise with provided ID does not exist.
     * @return  Message indicating success.
     * @author Tinashe Chamisa
     *
     */
  async deleteExercise (exercise: string, ctx: Context): Promise<any> {
    if (exercise === "") {
      throw new PreconditionFailedException("Parameter can not be left empty.")
    }
    try {
      await ctx.prisma.exercise.delete({
        where: {
          exerciseID: exercise
        }
      })
      return ("Exercise Deleted.")
    } catch (e) {
      throw new NotFoundException("Workout with provided ID does not exist")
    }
  }

  /**
   *Workout Service - Create Workout
   *
   * @param workoutTitle This is the string workout title
   * @param workoutDescription This is the string workout description
   * @param exercises This is an array of exercises
   * @param plannerID This is the string planner ID
   * @param ctx  This is the prisma context that is injected into the function.
   * @throws PreconditionFailedException if:
   *                               -Parameters can not be left empty.
   *
   * @return  Message indicating success.
   * @author Msi Sibanyoni
   *
   */
  async createWorkout (workoutTitle: string, workoutDescription: string, exercises : Exercise[], plannerID :string, ctx: Context) {
    if (workoutTitle === "" || workoutDescription === "" || plannerID === "" || exercises == null || workoutTitle == null || workoutDescription == null || plannerID == null) {
      throw new NotFoundException("Parameters can not be left empty.")
    }
    if ((Array.isArray(exercises) && exercises.length)) { // run create query with exercises only
      const exerciseConnection = exercises.map(n => {
        const container = {
          exerciseID: n.exerciseID
        }

        return container
      })
      const createdWorkout = await ctx.prisma.workout.create({
        data: {
          workoutTitle: workoutTitle,
          workoutDescription: workoutDescription,
          exercises: {
            connect: exerciseConnection
          },
          planner: {
            connect: {
              userID: plannerID
            }
          }
        }
      })
      const fullWorkout = await this.getWorkoutById(createdWorkout.workoutID, ctx)
      await this.generatePrettyWorkoutPDF(fullWorkout, ctx)
      return ("Workout Created.")
    } else {
      const createdWorkout = await ctx.prisma.workout.create({
        data: {
          workoutTitle: workoutTitle,
          workoutDescription: workoutDescription,
          planner: {
            connect: {
              userID: plannerID
            }
          }
        }
      })
      const fullWorkout = await this.getWorkoutById(createdWorkout.workoutID, ctx)
      await this.generatePrettyWorkoutPDF(fullWorkout, ctx)
      return ("Workout Created.")
    }
  }

  /**
   *Workout Service - Update Workout
   *
   * @param workoutID this is the string ID of the workout to be updated
   * @param workoutTitle This is the string workout title
   * @param workoutDescription This is the string workout description
   * @param exercises This is an array of exercises
   * @param plannerID This is the string planner ID
   * @param ctx  This is the prisma context that is injected into the function.
   * @throws PreconditionFailedException if:
   *                               -Parameters can not be left empty.
   *
   * @return  Message indicating success.
   * @author Msi Sibanyoni
   *
   */
  async updateWorkout (workoutID: string, workoutTitle: string, workoutDescription: string, exercises : Exercise[], plannerID :string, ctx: Context) {
    if (workoutTitle === "" || workoutDescription === "" || plannerID === "" || exercises == null || workoutTitle == null || workoutDescription == null || plannerID == null) {
      throw new NotFoundException("Parameters can not be left empty.")
    }
    if ((Array.isArray(exercises) && exercises.length)) { // run create query with exercises only
      const exerciseConnection = exercises.map(n => {
        const container = {
          exerciseID: n.exerciseID
        }

        return container
      })
      try {
        await ctx.prisma.workout.update({
          where: {
            workoutID: workoutID
          },
          data: {
            workoutTitle: workoutTitle,
            workoutDescription: workoutDescription,
            exercises: {
              set: exerciseConnection
            },
            planner: {
              connect: {
                userID: plannerID
              }
            }
          }
        })
        const updatedWorkout = await this.getWorkoutById(workoutID, ctx)
        await this.generatePrettyWorkoutPDF(updatedWorkout, ctx)
        return ("Workout Updated.")
      } catch (e) {
        throw new NotFoundException("Workout with provided ID does not exist")
      }
    } else {
      try {
        await ctx.prisma.workout.update({
          where: {
            workoutID: workoutID
          },
          data: {
            workoutTitle: workoutTitle,
            workoutDescription: workoutDescription,
            planner: {
              connect: {
                userID: plannerID
              }
            }
          }
        })
        const updatedWorkout = await this.getWorkoutById(workoutID, ctx)
        await this.generatePrettyWorkoutPDF(updatedWorkout, ctx)
        return ("Workout Updated.")
      } catch (e) {
        throw new NotFoundException("Workout with provided ID does not exist")
      }
    }
  }

  /**
     *Workout Service - Delete Workout
     *
     * @param workoutID this is the string ID of the workout to be delete
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws PreconditionFailedException if:
     *                               -Parameters can not be left empty.
     *
     * @throws NotFoundException if:
     *                               -Workout with provided ID does not exist.
     *
     * @return  Message indicating success.
     * @author Msi Sibanyoni
     *
     */
  async deleteWorkout (workoutID: string, ctx: Context) {
    if (workoutID === "") {
      throw new NotFoundException("Parameters can not be left empty.")
    }
    try {
      await ctx.prisma.workout.delete({
        where: {
          workoutID: workoutID
        }
      })
      return ("Workout Deleted.")
    } catch (e) {
      throw new NotFoundException("Workout with provided ID does not exist")
    }
  }

  /**
     *Workout Service - Generate Workout PDF
     *
     * @param workout This is the workout Object to be generated
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws PreconditionFailedException if:
     *                               -Parameters can not be left empty.
     *
     * @throws NotFoundException if:
     *                               -Workout with provided ID does not exist.
     *
     * @return  Message indicating success.
     * @author Msi Sibanyoni
     *
     */
  async generateWorkoutPDF (workout: any, ctx: Context) {
    if (workout == null) {
      throw new PreconditionFailedException("Invalid workout provided")
    }
    // eslint-disable-next-line new-cap
    const doc = new jsPDF()
    // TODO: Make heading font and a normal font & Consider adding an image
    doc.text(workout.workoutTitle, 80, 10)
    // TODO: getTags from exercises
    const splitWorkoutDesc = doc.splitTextToSize(workout.workoutDescription, 180)
    doc.text(splitWorkoutDesc, 15, 130)
    if (workout.exercises === undefined) {
      doc.save("./src/GeneratedWorkouts/" + workout.workoutTitle + "Workout.pdf")
    } else {
      for (let i = 0; i < workout.exercises.length; i++) {
        const exercise = await this.getExerciseByID(workout.exercises[i].exerciseID, ctx)
        doc.addPage("a4", "p")
        doc.text(exercise.exerciseTitle, 90, 10)
        if (exercise.tags.length !== 0) {
          const exerciseTagArray = exercise.tags.map(({ label }) => [label])
          const stringTags = exerciseTagArray.join()
          const splitTags = doc.splitTextToSize(stringTags, 180)
          doc.text("Tags: " + splitTags, 15, 30)
        }

        const splitExerciseDesc = doc.splitTextToSize(exercise.exerciseDescription, 180)
        doc.text(splitExerciseDesc, 15, 50)
        doc.text("Rep Range: " + exercise.repRange, 15, (60 + (splitExerciseDesc.length * 10)))
        doc.text("Sets: " + exercise.sets.toString(), 90, (60 + (splitExerciseDesc.length * 10)))
        // doc.text(exercise.Posedescription, 10, 90);
        doc.text("Rest Period: " + exercise.restPeriod.toString() + " seconds.", 15, (80 + (splitExerciseDesc.length * 10)))
        doc.text("Exercise Duration: " + exercise.duration.toString() + " seconds or " + (exercise.duration / 60).toString() + " minutes", 15, (100 + (splitExerciseDesc.length * 10)))
      }
      doc.save("./src/GeneratedWorkouts/" + workout.workoutTitle + "WorkoutX.pdf")
    }
  }

  /**
   *Workout Service - Generate Pretty Workout PDF
   *
   * @param workout This is the workout Object to be generated as a pdf
   * @param ctx  This is the prisma context that is injected into the function.
   * @throws PreconditionFailedException if:
   *                               -Parameters can not be left empty.
   *
   * @throws NotFoundException if:
   *                               -Workout with provided ID does not exist.
   *
   * @return  Message indicating success.
   * @author Msi Sibanyoni
   *
   */
  async generatePrettyWorkoutPDF (workout: any, ctx: Context) {
    const uint8ArrayFP = fs.readFileSync("./src/Assets/frontPageTemplate.pdf")
    const pdfDoc = await PDFDocument.load(uint8ArrayFP)
    const frontPage = pdfDoc.getPages()
    const firstPage = frontPage[0]
    // eslint-disable-next-line no-unused-vars
    const { width, height } = firstPage.getSize()
    // console.log(width)
    // console.log(height)

    firstPage.drawText(workout.workoutTitle, {
      x: 310,
      y: 210,
      size: 40
    })
    const userObject = await this.userService.findUserByUUID(workout.plannerID, ctx)
    const userFisrtLastName = userObject.firstName + " " + userObject.lastName
    firstPage.drawText("Author ", {
      x: 300,
      y: 160,
      size: 21
    })
    firstPage.drawText(userFisrtLastName, {
      x: 390,
      y: 160,
      size: 16
    })

    firstPage.drawText("Description ", {
      x: 300,
      y: 120,
      size: 18
    })
    // eslint-disable-next-line no-unused-vars
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const form = pdfDoc.getForm()
    const textField = form.createTextField("workout.description")
    textField.enableMultiline()
    textField.setText("hujieswdhudhuew " + workout.workoutDescription)
    textField.addToPage(firstPage, {
      x: 300,
      y: 22,
      width: 280,
      height: 90,
      textColor: rgb(0, 0, 0),

      borderWidth: 0
    })

    // OTHER PAGES

    // Bring template in - [Amount of exercises]
    if (workout.exercises === undefined) {
      fs.writeFileSync("./src/GeneratedWorkouts/" + workout.workoutTitle + "Workout.pdf", await pdfDoc.save())
    } else {
      let exercisePosCount = 0
      for (let i = 0; i < workout.exercises.length; i++) {
        if (exercisePosCount < 1) {
          const uint8ArrayOP = fs.readFileSync("./src/Assets/otherPagesTemplate.pdf")
          const pdfDoc2 = await PDFDocument.load(uint8ArrayOP)
          const [existingPage] = await pdfDoc.copyPages(pdfDoc2, [0])
          const currentPage = pdfDoc.addPage(existingPage)

          const exercise = await this.getExerciseByID(workout.exercises[i].exerciseID, ctx)
          currentPage.drawText(exercise.exerciseTitle, {
            x: 20,
            y: 740,
            size: 19
          })
          // Description
          currentPage.drawText("Description", {
            x: 20,
            y: 710,
            size: 12
          })
          currentPage.drawText(exercise.exerciseDescription, {
            x: 20,
            y: 700,
            size: 10
          })
          // Rep Range
          currentPage.drawText("Rep Range ", {
            x: 20,
            y: 620,
            size: 12
          })
          currentPage.drawText(exercise.repRange, {
            x: 130,
            y: 620,
            size: 12
          })
          // Sets
          currentPage.drawText("Sets ".toString(), {
            x: 20,
            y: 590,
            size: 12
          })
          currentPage.drawText(exercise.sets.toString(), {
            x: 130,
            y: 590,
            size: 12
          })
          // RestPeriod
          currentPage.drawText("Rest Period ", {
            x: 20,
            y: 560,
            size: 12
          })
          currentPage.drawText(exercise.restPeriod.toString(), {
            x: 130,
            y: 560,
            size: 12
          })
          // Exercise Duration
          currentPage.drawText("Exercise Duration ", {
            x: 20,
            y: 530,
            size: 12
          })
          currentPage.drawText((exercise.duration / 60).toString() + " minutes", {
            x: 130,
            y: 530,
            size: 12
          })
          // Planner
          currentPage.drawText("Planner ", {
            x: 20,
            y: 500,
            size: 12
          })
          currentPage.drawText(userFisrtLastName, {
            x: 130,
            y: 500,
            size: 12
          })
          exercisePosCount += 1
        } else {
          const currentPage = pdfDoc.getPage(pdfDoc.getPageCount() - 1)
          const exercise = await this.getExerciseByID(workout.exercises[i].exerciseID, ctx)
          currentPage.drawText(exercise.exerciseTitle, {
            x: 20,
            y: 370,
            size: 19
          })
          exercisePosCount -= 1
        }
      }
      fs.writeFileSync("./src/GeneratedWorkouts/" + workout.workoutTitle + "Workout.pdf", await pdfDoc.save())
    }
  }

  /**
     *Workout Service - Create Tag
     *
     * @param label This is the title of the tag.
     * @param textColour This is the text colour of the tag.
     * @param backgroundColour  This is the background colour of the tag.
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws NotAcceptableException if:
     *                               -There is any type of profanity found in the label, using npm 'bad-words'.
     * @throws ConflictException if:
     *                               -There is already a tag that exists in the database with the given label.
     * @throws BadRequestException if:
     *                               -There is a precondition net met, such as parameters not given.
     * @return  Promise tag object.
     * @author Tinashe Chamisa
     *
     */
  async createTag (label: string, textColour: string, backgroundColour: string, ctx: Context): Promise<any> {
    if (filter.isProfane(label)) {
      throw new NotAcceptableException("Profanity contained in label title.")
    }

    if (label === "" || textColour === "" || backgroundColour === "") {
      throw new PreconditionFailedException("Parameters can not be left empty.")
    }
    try {
      label = this.format(label)
      const find = await ctx.prisma.tag.findUnique({ // search for tags that meet the requirement
        where: {
          label
        },
        select: {
          label: true
        }
      })

      if (find != null) { // if duplicates are detected, throw error
        throw new ConflictException("Duplicate", "Label already exists in database.")
      }

      const createdUser = await ctx.prisma.tag.create({
        data: {
          label,
          textColour,
          backgroundColour
        }
      })
      if (createdUser == null) { // if JSON object is empty, send error code
        throw new BadRequestException("Could not create tag.")
      }

      return createdUser
    } catch (err) {
      throw new BadRequestException(err, "Could not fulfill request.")
    }
  }

  /**
     *Workout Service - Get Tags
     *
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No tags were found in the database.
     * @return  Promise array of tag object/s.
     * @author Tinashe Chamisa
     *
     */
  async getTags (ctx: Context): Promise<any> {
    try {
      const tags = await ctx.prisma.tag.findMany({ // search and retrieve all tags
        select: {
          label: true,
          textColour: true,
          backgroundColour: true
        }
      })

      if (tags.length === 0) { // if JSON object is empty, send error code
        throw new NotFoundException("No tags were found in the database.")
      }

      return tags
    } catch (err) {
      throw new BadRequestException(err, "Could not fulfill request.")
    }
  }

  /**
     *Workout Service - Add new tags
     *
     * @param tags array of tags to be added to database
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws PreconditionFailedException if:
     *                               -Cannot work with empty tags.
     *
     * @throws NotFoundException if:
     *                               -Workout with provided ID does not exist.
     *
     * @return  Message indicating success.
     * @author Msi Sibanyoni
     *
     */
  async addNewTags (tags: Tag[], ctx:Context) {
    if (!(Array.isArray(tags) && tags.length)) {
      throw new PreconditionFailedException("Cannot work with empty tags.")
    }
    for (let i = 0; i < tags.length; i++) {
      tags[i].label = this.format(tags[i].label)
    }
    tags.sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0))

    // check if there are any tags in database
    const tagCount = await ctx.prisma.tag.count()
    if (tagCount === 0) { // if none add from input tags
      for (let i = 0; i < tags.length; i++) {
        await this.createTag(tags[i].label, tags[i].textColour, tags[i].backgroundColour, ctx)
      }
    } else { // find uncommon tags and add them to tags table
      const databaseTags = await this.getTags(ctx)
      const uncommonElements = tags.filter(({ label: label1 }) => !databaseTags.some(({ label: label2 }) => label1 === label2))
      if (uncommonElements.length !== 0) {
        for (let i = 0; i < uncommonElements.length; i++) {
          await this.createTag(uncommonElements[i].label, uncommonElements[i].textColour, uncommonElements[i].backgroundColour, ctx)
        }
      }
    }
  }

  /**
   *Workout Service - textToSpeech
   *
   * @param text This parameter includes the string that needs to be converted to a .wav file (Audio file).
   * @param fileName  This is the name of the file that will be stored on the server.
   * @throws BadRequestException if:
   *                               -Conversion from text to speech has failed.
   * @return  Message indicating success (text file has been created).
   * @author Zelealem Tesema
   *
   */
  async textToSpeech (text:String, fileName:String) {
    const gtts = require("node-gtts")("en")
    const path = require("path")
    const filepath = path.join("./src/GeneratedTextSpeech/", fileName + ".wav")

    try {
      gtts.save(filepath, text, function () {
      })

      return "text file has been created"
    } catch (err) {
      throw new BadRequestException("Could not generate text to speech")
    }
  }

  /**
   *Workout Service - Convert to Video
   * @brief Function that takes a workout object as a parameter and converts each exercises' images into a video
   * @param workout  The workout object
   * @param ctx  This is the prisma context that is injected into the function.
   * @throws NotFoundException if:
   *                               -No images are found.
   * @return  Message indicating success.
   * @author Tinashe Chamisa
   *
   */
  async createVideo (workout: Workout, ctx: Context): Promise<any> {
    /*
      First, check for validity of workout object. Next, loop through exercises. While on each exercise, add poses to image array. Finally, create video.
    */

    if (workout == null) {
      throw new PreconditionFailedException("Invalid Workout object passed in.")
    }

    let exercises: Object[] = []

    // eslint-disable-next-line no-useless-catch
    try {
      const listOfExercises = await ctx.prisma.exercise.findMany({
        where: {
          plannerID: workout.plannerID
        },
        select: {
          exerciseID: true
        }
      })
      if (!(Array.isArray(listOfExercises) && listOfExercises.length)) { // if JSON object is empty, send error code
        throw new NotFoundException("No Exercises were found in the database with the specified workout.")
      } else {
        exercises = listOfExercises
      }
    } catch (err) {
      throw err
    }
    
    const images = [
      {
        path: "./src/Workout/images/workoutImagere.jpg",
        caption: "Shake that booty and get a good workout in",
        loop: 15
      },
      {
        path: "./src/Workout/images/workoutImagere.jpg",
        caption: "Why was this so damn easy"
      },
      {
        path: "./src/Workout/images/workoutImagere.jpg",
        caption: "Shake that booty again and lets get it"
      },
      {
        path: "./src/Workout/images/workoutImagere.jpg",
        caption: "Keep shaking that booty"
      },
      {
        path: "./src/Workout/images/extraImage.jpg",
        caption: "Awe thats done, get ready for the next exercise you slut"
      }
    ]

    const videoOptions = {
      fps: 25,
      loop: 5, // seconds
      transition: true,
      transitionDuration: 1, // seconds
      videoBitrate: 1024,
      videoCodec: "libx264",
      size: "640x?",
      audioBitrate: "128k",
      audioChannels: 2,
      format: "mp4",
      pixelFormat: "yuv420p"
    }

    videoshow(images, videoOptions)
      .audio("./src/Workout/audio/song1.mp3")
      .save("./src/videoGeneration/videoAUDIO.mp4")
      .on("start", function (command) {
        console.log("ffmpeg process started:", command)
      })
      .on("error", function (err, stdout, stderr) {
        console.error("Error:", err)
        console.error("ffmpeg stderr:", stderr)
      })
      .on("end", function (output) {
        console.error("Video created in:", output)
      })
    /*
    const options = {
      pythonOptions: ["-u"],
      pythonPath: "../venv/Scripts/python.exe",
      scriptPath: "./src/videoGeneration",
      args: []
    }
    try {
      PythonShell.run("videoPython.py", options, function (err, results) {
        if (err) throw err
        console.log(results+"s")
      })
    } catch (e) { console.log(e) }

    setTimeout(function () {
      exec("ffmpeg -i ./src/videoGeneration/Images/movieTemp.avi -i ./src/videoGeneration/Sounds/audio1.mp3 -map 0 -map 1:a -c:v copy -shortest ./src/videoGeneration/Videos/output.mkv", (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`)
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`)
        }
        console.log(`stdout: ${stdout}`)
      })
    }, 5000)

     */
  }
}
