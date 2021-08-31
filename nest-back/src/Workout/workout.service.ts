import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  PreconditionFailedException,
  ServiceUnavailableException
} from "@nestjs/common"
import { Context } from "../../context"
import { Exercise, Tag } from "@prisma/client"
import { PrismaService } from "../Prisma/prisma.service"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import * as fs from "fs"
import { UserService } from "../User/user.service"
import fontkit from "@pdf-lib/fontkit"

const Filter = require("bad-words"); const filter = new Filter()
const videoshow = require("videoshow")
const base64ToImage = require("base64-to-image")
const audioconcat = require("audioconcat")
// const { getAudioDurationInSeconds } = require("get-audio-duration")
// const soxCommand = require("sox-audio")
// const sharp = require("sharp")
// const resizeImg = require("resize-img")

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
      // add images for each exercise

      interface exercise {
        exerciseID: string,
        exerciseTitle: string,
        exerciseDescription: string,
        repRange: any,
        sets: any,
        poseDescription: string,
        restPeriod: any,
        tags: any,
        duration: any,
        images: any
      }

      const exercisesWithImages: exercise[] = []

      for (let i = 0; i < exercises.length; i++) {
        const image = await this.getExerciseBase64(exercises[i].exerciseID)
        exercisesWithImages.push({
          exerciseID: exercises[i].exerciseID,
          exerciseTitle: exercises[i].exerciseTitle,
          exerciseDescription: exercises[i].exerciseDescription,
          repRange: exercises[i].repRange,
          sets: exercises[i].sets,
          poseDescription: exercises[i].poseDescription,
          restPeriod: exercises[i].restPeriod,
          tags: exercises[i].tags,
          duration: exercises[i].duration,
          images: image
        })
      }

      return exercisesWithImages
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

      if (typeof exercise === "undefined" || exercise === null) { // if JSON object is empty, send error code
        throw new NotFoundException("No exercises were found in the database with the specified title.")
      }
      // add images for each exercise

      interface Exercise {
        exerciseID: string,
        exerciseTitle: string,
        exerciseDescription: string,
        repRange: any,
        sets: any,
        poseDescription: string,
        restPeriod: any,
        tags: any,
        duration: any,
        images: any
      }

      const exercisesWithImages: Exercise[] = []

      for (let i = 0; i < exercise.length; i++) {
        const image = await this.getExerciseBase64(exercise[i].exerciseID)
        exercisesWithImages.push({
          exerciseID: exercise[i].exerciseID,
          exerciseTitle: exercise[i].exerciseTitle,
          exerciseDescription: exercise[i].exerciseDescription,
          repRange: exercise[i].repRange,
          sets: exercise[i].sets,
          poseDescription: exercise[i].poseDescription,
          restPeriod: exercise[i].restPeriod,
          tags: exercise[i].tags,
          duration: exercise[i].duration,
          images: image
        })
      }

      return exercisesWithImages
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
        // add images for each exercise

        const image = await this.getExerciseBase64(exercise.exerciseID)
        return {
          exerciseID: exercise.exerciseID,
          exerciseTitle: exercise.exerciseTitle,
          exerciseDescription: exercise.exerciseDescription,
          repRange: exercise.repRange,
          sets: exercise.sets,
          poseDescription: exercise.poseDescription,
          restPeriod: exercise.restPeriod,
          tags: exercise.tags,
          duration: exercise.duration,
          images: image
        }
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
        // add images for each exercise

        interface Exercise {
          exerciseID: string,
          exerciseTitle: string,
          exerciseDescription: string,
          repRange: any,
          sets: any,
          poseDescription: string,
          restPeriod: any,
          tags: any,
          duration: any,
          images: any
        }

        const exercisesWithImages: Exercise[] = []

        for (let i = 0; i < exercise.length; i++) {
          const image = await this.getExerciseBase64(exercise[i].exerciseID)
          exercisesWithImages.push({
            exerciseID: exercise[i].exerciseID,
            exerciseTitle: exercise[i].exerciseTitle,
            exerciseDescription: exercise[i].exerciseDescription,
            repRange: exercise[i].repRange,
            sets: exercise[i].sets,
            poseDescription: exercise[i].poseDescription,
            restPeriod: exercise[i].restPeriod,
            tags: exercise[i].tags,
            duration: exercise[i].duration,
            images: image
          })
        }

        return exercisesWithImages
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
   * @param images This is the image array of the poses for the exercise
   * @param ctx  This is the prisma context that is injected into the function.
   * @throws PreconditionFailedException if:
   *                               -Not all parameters are given.
   * @throws NotFoundException if:
   *                               -An exercise with provided ID does not exist.
   * @return  Message indicating success.
   * @author Msi Sibanyoni
   *
   */
  async createExercise (title:string, description:string, repRange:string, sets:number, poseDescription:string, restPeriod:number, tags:Tag[], duration:number, plannerID:string, images:string[], ctx: Context) {
    if (images.length === 0) {
      throw new PreconditionFailedException("Cannot create exercise with no images.")
    }
    if (title === "" || description === "" || poseDescription === "" || tags == null || plannerID === "" || title == null || description == null || poseDescription == null) {
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
      const createdExercise = await ctx.prisma.exercise.create({
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
      const exerciseDetails = await this.getExerciseByID(createdExercise.exerciseID, ctx)
      await this.saveImagesToJSON(exerciseDetails, images)
      return ("Exercise created.")
    } else {
      const createdExercise = await ctx.prisma.exercise.create({
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
      const exerciseDetails = await this.getExerciseByID(createdExercise.exerciseID, ctx)
      await this.saveImagesToJSON(exerciseDetails, images)
      return ("Exercise created.")
    }
  }

  /**
   *Workout Service - Update Exercise
   *
   * @param exercise This is the ID of the exercise.
   * @param images String array of base64 images to use for workout
   * @throws PreconditionFailedException if:
   *                               -Not all parameters are given.
   * @throws NotFoundException if:
   *                               -An exercise with provided ID does not exist.
   * @return  Message indicating success.
   * @author Tinashe Chamisa
   *
   */
  async saveImagesToJSON (exercise:any, images:string[]) {
    const arrayImages : Array<string> = []
    images.forEach(function (item, index) {
      if (item != null) {
        arrayImages.push(item)
      }
    })
    // TODO: Add create if file doesnt exist
    fs.readFile("./src/createdWorkoutImages.json", function (err, data) {
      if (err) throw err
      const json = JSON.parse(data.toString())
      const final = {}
      final["ID"] = exercise.exerciseID
      final["poseDescription"] = exercise.poseDescription
      final["images"] = arrayImages
      // eslint-disable-next-line array-callback-return
      const index = json.findIndex(element => {
        if (element["ID"] === exercise.exerciseID) {
          return true
        }
      })
      if (index !== -1) {
        json[index] = final
      } else {
        json.push(final)
      }

      fs.writeFile("./src/createdWorkoutImages.json", JSON.stringify(json), function (err) {
        if (err) throw err
      })
    })
  }

  /**
   *Workout Service - Update Exercise
   *
   * @param exercise This is the ID of the exercise.
   * @param title This is the title of the exercise.
   * @param description This is the description of the exercise.
   * @param repRange This is the amount of reps.
   * @param sets This is the amount of sets.
   * @param poseDescription This is the description of the poses
   * @param restPeriod This is the rest period of the exercise.
   * @param tags this is an array of tags
   * @param duration This is the duration of the exercise.
   * @param plannerID This is the planner ID
   * @param images This is the image array of the poses for the exercise
   * @param ctx  This is the prisma context that is injected into the function.
   * @throws PreconditionFailedException if:
   *                               -Not all parameters are given.
   * @throws NotFoundException if:
   *                               -An exercise with provided ID does not exist.
   * @return  Message indicating success.
   * @author Tinashe Chamisa
   *
   */
  async updateExercise (exercise: string, title: string, description: string, repRange: string, sets: number, poseDescription: string, restPeriod: number, tags: Tag[], duration: number, plannerID:string, images:string[], ctx: Context): Promise<any> {
    if (exercise === "" || title === "" || description === "" || poseDescription === "" || tags == null || plannerID === "" || title == null || description == null || poseDescription == null) {
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
        const updatedExercise = await ctx.prisma.exercise.update({
          where: {
            exerciseID: exercise
          },
          data: {
            exerciseID: exercise,
            exerciseTitle: title,
            exerciseDescription: description,
            repRange: repRange,
            sets: sets,
            poseDescription: poseDescription,
            restPeriod: restPeriod,
            tags: {
              connect: tagConnection
            },
            duration: duration,
            planner: {
              connect: {
                userID: plannerID
              }
            }
          }
        })
        if (images !== null && images.length) {
          const exerciseDetails = await this.getExerciseByID(updatedExercise.exerciseID, ctx)
          await this.saveImagesToJSON(exerciseDetails, images)
        }
        return "Exercise updated."
      } else {
        const updatedExercise = await ctx.prisma.exercise.update({
          where: {
            exerciseID: exercise
          },
          data: {
            exerciseID: exercise,
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
        if (images !== null && images.length) {
          const exerciseDetails = await this.getExerciseByID(updatedExercise.exerciseID, ctx)
          await this.saveImagesToJSON(exerciseDetails, images)
        }
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
  // async arrayRemove (arr, value) {
  //   return arr.filter(function (ele) {
  //     return ele !== value
  //   })
  // }

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
      throw new NotFoundException("Exercise with provided ID does not exist")
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

      await this.createVideo(fullWorkout.workoutID, ctx)
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
        await this.createVideo(updatedWorkout.workoutID, ctx)
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
      // const retrievedWorkout = await this.getWorkoutById(workoutID, ctx)
      // fs.unlink("./src/GeneratedWorkouts/" + retrievedWorkout.workoutTitle + "Workout.pdf", (err) => {
      //   if (err) {
      //     throw err
      //   }
      // })
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
   *Workout Service - Generate Pretty Workout PDF
   *
   * @param workout This is the workout Object to be generated as a pdf
   * @param images
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
    const uint8ArrayFP = fs.readFileSync("./src/Assets/PDFTemplates/frontPageTemplate.pdf")
    const pdfDoc = await PDFDocument.load(uint8ArrayFP)
    pdfDoc.registerFontkit(fontkit)
    const frontPage = pdfDoc.getPages()
    const firstPage = frontPage[0]
    const SFBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const SFRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)

    const titleHeadingColour = rgb(0.13, 0.185, 0.24)
    const fieldsHeadingColour = rgb(0.071, 0.22, 0.4117)
    try {
      firstPage.drawText(workout.workoutTitle, {
        x: 310,
        y: 210,
        size: 38,
        font: SFBold
      })
      const userObject = await this.userService.findUserByUUID(workout.plannerID, ctx)
      const userFirstLastName = userObject.firstName + " " + userObject.lastName
      firstPage.drawText("Author ", {
        x: 300,
        y: 160,
        size: 21,
        font: SFBold
      })
      firstPage.drawText(userFirstLastName, {
        x: 390,
        y: 160,
        size: 16,
        font: SFRegular
      })

      firstPage.drawText("Description ", {
        x: 300,
        y: 120,
        size: 18,
        font: SFBold
      })
      const form = pdfDoc.getForm()
      const textField = form.createTextField("workout.description")
      textField.enableMultiline()
      textField.enableReadOnly()
      textField.setText(workout.workoutDescription)
      textField.addToPage(firstPage, {
        x: 300,
        y: 22,
        width: 280,
        height: 90,
        borderWidth: 0
      })

      // OTHER PAGES

      // Bring template in - [Amount of exercises]
      if (workout.exercises === undefined) {
        fs.writeFileSync("./src/GeneratedWorkouts/" + workout.workoutID + ".pdf", await pdfDoc.save())
      } else {
        let exercisePosCount = 0
        for (let i = 0; i < workout.exercises.length; i++) {
          if (exercisePosCount < 1) {
            const uint8ArrayOP = fs.readFileSync("./src/Assets/PDFTemplates/otherPagesTemplate.pdf")
            const pdfDoc2 = await PDFDocument.load(uint8ArrayOP)
            const [existingPage] = await pdfDoc.copyPages(pdfDoc2, [0])
            const currentPage = pdfDoc.addPage(existingPage)
            currentPage.drawText(workout.exercises[i].exerciseTitle, {
              x: 20,
              y: 740,
              size: 19,
              font: SFBold,
              color: titleHeadingColour
            })
            // Description
            currentPage.drawText("Exercise Description", {
              x: 20,
              y: 710,
              size: 12,
              font: SFBold,
              color: fieldsHeadingColour
            })
            currentPage.drawText(workout.exercises[i].exerciseDescription, {
              x: 20,
              y: 700,
              size: 10,
              font: SFRegular
            })
            // Rep Range
            currentPage.drawText("Rep Range ", {
              x: 20,
              y: 620,
              size: 12,
              font: SFBold,
              color: fieldsHeadingColour
            })
            let repRange = "Consult Personal Trainer."
            if (workout.exercises[i].repRange !== null) {
              repRange = workout.exercises[i].repRange.toString()
            }
            currentPage.drawText(repRange, {
              x: 130,
              y: 620,
              size: 12,
              font: SFRegular
            })
            // Sets
            currentPage.drawText("Sets ".toString(), {
              x: 20,
              y: 600,
              size: 12,
              font: SFBold,
              color: fieldsHeadingColour
            })
            let sets = "Consult Personal Trainer."
            if (workout.exercises[i].sets !== null) {
              sets = workout.exercises[i].sets.toString()
            }
            currentPage.drawText(sets, {
              x: 130,
              y: 600,
              size: 12,
              font: SFRegular
            })
            // RestPeriod
            currentPage.drawText("Rest Period ", {
              x: 20,
              y: 570,
              size: 12,
              font: SFBold,
              color: fieldsHeadingColour
            })
            let restPeriod = "Consult Personal Trainer."
            if (workout.exercises[i].restPeriod !== null) {
              restPeriod = workout.exercises[i].restPeriod.toString()
            }
            currentPage.drawText(restPeriod, {
              x: 130,
              y: 570,
              size: 12,
              font: SFRegular
            })
            // Exercise Duration
            currentPage.drawText("Exercise Duration ", {
              x: 20,
              y: 540,
              size: 12,
              font: SFBold,
              color: fieldsHeadingColour
            })
            let duration = "Consult Personal Trainer."
            if (workout.exercises[i].duration !== null) {
              duration = (workout.exercises[i].duration / 60).toString()
            }
            currentPage.drawText(duration + " minutes", {
              x: 130,
              y: 540,
              size: 12,
              font: SFRegular
            })
            // Planner
            currentPage.drawText("Planner ", {
              x: 20,
              y: 510,
              size: 12,
              font: SFBold,
              color: fieldsHeadingColour
            })
            currentPage.drawText(userFirstLastName, {
              x: 130,
              y: 510,
              size: 12,
              font: SFRegular
            })
            // Images
            const jsonTest = fs.readFileSync("./src/createdWorkoutImages.json", "utf8")
            const json = JSON.parse(jsonTest)
            const exerciseImages = json.find(({ ID }) => ID === workout.exercises[i].exerciseID)
            if (exerciseImages !== undefined) {
              for (let c = 0; c < exerciseImages.images.length; c++) {
                const currentImage = await pdfDoc.embedJpg(exerciseImages.images[c])
                currentPage.drawImage(currentImage, {
                  x: 20 + (c * 150),
                  y: 400,
                  width: 120,
                  height: 90
                })
              }
            }
            exercisePosCount += 1
          } else {
            const currentPage = pdfDoc.getPage(pdfDoc.getPageCount() - 1)
            currentPage.drawText(workout.exercises[i].exerciseTitle, {
              x: 20,
              y: 370,
              size: 19,
              font: SFBold,
              color: titleHeadingColour
            })
            currentPage.drawText("Exercise Description", {
              x: 20,
              y: 340,
              size: 12,
              font: SFBold,
              color: fieldsHeadingColour
            })
            currentPage.drawText(workout.exercises[i].exerciseDescription, {
              x: 20,
              y: 330,
              size: 10,
              font: SFRegular
            })
            // Rep Range
            currentPage.drawText("Rep Range ", {
              x: 20,
              y: 250,
              size: 12,
              font: SFBold,
              color: fieldsHeadingColour
            })
            let repRange = "Consult Personal Trainer."
            if (workout.exercises[i].repRange !== null) {
              repRange = workout.exercises[i].repRange.toString()
            }
            currentPage.drawText(repRange, {
              x: 130,
              y: 250,
              size: 12,
              font: SFRegular
            })
            // Sets
            currentPage.drawText("Sets ".toString(), {
              x: 20,
              y: 220,
              size: 12,
              font: SFBold,
              color: fieldsHeadingColour
            })
            let sets = "Consult Personal Trainer."
            if (workout.exercises[i].sets !== null) {
              sets = workout.exercises[i].sets.toString()
            }
            currentPage.drawText(sets, {
              x: 130,
              y: 220,
              size: 12,
              font: SFRegular
            })
            // RestPeriod
            currentPage.drawText("Rest Period ", {
              x: 20,
              y: 190,
              size: 12,
              font: SFBold,
              color: fieldsHeadingColour
            })
            let restPeriod = "Consult Personal Trainer."
            if (workout.exercises[i].restPeriod !== null) {
              restPeriod = workout.exercises[i].restPeriod.toString()
            }
            currentPage.drawText(restPeriod, {
              x: 130,
              y: 190,
              size: 12,
              font: SFRegular
            })
            // Exercise Duration
            currentPage.drawText("Exercise Duration ", {
              x: 20,
              y: 160,
              size: 12,
              font: SFBold,
              color: fieldsHeadingColour
            })
            let duration = "Consult Personal Trainer."
            if (workout.exercises[i].duration !== null) {
              duration = (workout.exercises[i].duration / 60).toString() + " minutes."
            }
            currentPage.drawText(duration, {
              x: 130,
              y: 160,
              size: 12,
              font: SFRegular
            })
            // Planner
            currentPage.drawText("Planner ", {
              x: 20,
              y: 130,
              size: 12,
              font: SFBold,
              color: fieldsHeadingColour
            })
            currentPage.drawText(userFirstLastName, {
              x: 130,
              y: 130,
              size: 12,
              font: SFRegular
            })
            // Images
            const jsonTest = fs.readFileSync("./src/createdWorkoutImages.json", "utf8")
            const json = JSON.parse(jsonTest)
            const exerciseImages = json.find(({ ID }) => ID === workout.exercises[i].exerciseID)
            if (exerciseImages !== undefined) {
              for (let c = 0; c < exerciseImages.images.length; c++) {
                const currentImage = await pdfDoc.embedJpg(exerciseImages.images[c])
                currentPage.drawImage(currentImage, {
                  x: 20 + (c * 150),
                  y: 20,
                  width: 120,
                  height: 90
                })
              }
            }
            exercisePosCount -= 1
          }
        }
        fs.writeFileSync("./src/GeneratedWorkouts/" + workout.workoutID + ".pdf", await pdfDoc.save())
      }
      return
    } catch (err) {
      throw new BadRequestException("Could not generate workout PDF.")
    }
  }

  /**
   *Workout Service - Get workout PDF
   *
   * @param workoutID
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
  async getWorkoutPDF (workoutID: string, ctx: Context): Promise<any> {
    if (workoutID === null || workoutID === "") {
      throw new NotAcceptableException("Workout ID cannot be empty")
    }

    try {
      const workoutObject = await this.getWorkoutById(workoutID, ctx)
      await this.generatePrettyWorkoutPDF(workoutObject, ctx)

      fs.readFile("./src/GeneratedWorkouts/" + workoutObject.workoutID + ".pdf", function (err, data) {
        if (err) throw err
      })
      const uint8ArrayFP = fs.readFileSync("./src/GeneratedWorkouts/" + workoutObject.workoutID + ".pdf")
      const pdfDoc = await PDFDocument.load(uint8ArrayFP)
      return await pdfDoc.saveAsBase64({ dataUri: true })
    } catch (E) {
      throw new BadRequestException("Cannot return workout pdf.")
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
    const filepath = path.join("./src/Workout/GeneratedTextSpeech/", fileName + ".mp3")

    try {
      await gtts.save(filepath, text, function () {
      })

      return "text file has been created"
    } catch (err) {
      throw new BadRequestException("Could not generate text to speech")
    }
  }

  /**
   *Workout Controller - Create Video
   *
   * @param workoutID  The workout ID
   * @param ctx  This is the prisma context that is injected into the function.
   * @throws NotFoundException if:
   *                               -No workout was found in the database with the specified workout ID.
   * @throws ApiPreconditionFailedResponse if:
   *                               -Invalid Workout object passed in.
   * @throws ApiServiceUnavailableResponse if:
   *                               -Unable to create video.
   * @throws ApiInternalServerErrorResponse if:
   *                               -Internal server error.
   * @return  Message indicating success.
   * @author Tinashe Chamisa
   *
   */
  async createVideo (workoutID: string, ctx: Context): Promise<any> {
    if (workoutID == null || workoutID === "") {
      throw new PreconditionFailedException("Invalid Workout ID passed in.")
    }
    const exercisesID: string[] = []
    // eslint-disable-next-line no-useless-catch
    try {
      const workout = await this.getWorkoutById(workoutID, ctx)
      if (workout === null) { // if JSON object is empty, send error code
        throw new NotFoundException("No workout was found in the database with the specified workout ID.")
      } else {
        workout.exercises.forEach(element => {
          exercisesID.push(element.exerciseID)
        })
      }
    } catch (err) {
      throw err
    }

    if (exercisesID.length === 0) {
      throw new BadRequestException("Cant create video without exercises")
    }

    interface IMAGE {
      path: string,
      caption: string,
      loop: number
    }

    const images: IMAGE[] = []
    const fileNames = [""]
    let lengthOfVideo = 0

    // retrieve all exercises poses one by one from the local storage
    for (let i = 0; i < exercisesID.length; i++) {
      let temp: any[] = []
      if ((temp = await this.getExerciseBase64(exercisesID[i])) === []) {
        console.log("error")
      } else {
        console.log("found")

        const path = "./src/videoGeneration/Images/"

        // null checker for nulls in temp
        const base64Images: string[] = []
        for (let k = 0; k < temp.length; k++) {
          if (temp[k] !== null) { base64Images.push(temp[k]) }
        }

        // Loop through poses of an exercise
        const exerciseDescription = this.getExerciseDescription(exercisesID[i])

        for (let j = 0; j < base64Images.length; j++) {
          const fileName = "image-" + exercisesID[i] + "-" + (j + 1) // filename format: image + exercise id + - + pose number
          fileNames.push(fileName)

          // convert base64 to image
          // eslint-disable-next-line no-useless-catch
          try {
            const optionalObj = { fileName, type: "jpg" }
            await base64ToImage(base64Images[j], path, optionalObj)
          } catch (e) { throw e }

          // push image to array
          images.push({
            path: "./src/videoGeneration/Images/" + fileName + ".jpg",
            caption: exerciseDescription,
            loop: 20
          })

          lengthOfVideo += 20
        }

        if (base64Images.length !== 1 && i < base64Images.length - 1) {
          images.push({
            path: "./src/videoGeneration/Images/kenzoLogo.jpg",
            caption: "Exercise " + (i + 1) + " complete! On to the next...",
            loop: 5
          })
        } else {
          images.push({
            path: "./src/videoGeneration/Images/kenzoLogo.jpg",
            caption: "Workout complete!",
            loop: 5
          })
        }
        lengthOfVideo += 5
      }
    }
    const videoOptions = {
      fps: 25,
      loop: lengthOfVideo, // length of video in seconds
      transition: true,
      transitionDuration: 1, // seconds
      videoBitrate: 1024,
      videoCodec: "libx264",
      size: "1920x1080",
      audioBitrate: "128k",
      audioChannels: 2,
      format: "mp4",
      pixelFormat: "yuv420p"
    }

    // console.log(images)

    videoshow(images, videoOptions)
      .audio("./src/videoGeneration/Sounds/song1.mp3")
      .save("./src/videoGeneration/Videos/" + workoutID + ".mp4")
      .on("start", function (command) {
        console.log("ffmpeg process started:", command)
      })
      .on("error", function (err, stdout, stderr) {
        console.error("Error:", err)
        console.error("ffmpeg stderr:", stderr)
        throw new ServiceUnavailableException("Unable to create video.")
      })
      .on("end", function (output) {
        console.error("Video created in:", output)
        return "Successfully created video."
      })
  }

  async mixAudio (): Promise<any> {
    const songs: string[] = []
    const subtitles = [
      "He said he was not there yesterday; however, many people saw him there.",
      "Getting up at dawn is for the birds.",
      "Warm beer on a cold day isn't my idea of fun."
    ]
    // create tts
    for (let i = 0; i < subtitles.length; i++) {
      await this.textToSpeech(subtitles[i], "exercise1Pose" + (i + 1))
      songs.push("./src/Workout/GeneratedTextSpeech/exercise1Pose" + (i + 1) + ".mp3")
    }
    console.log(songs)

    await this.audioConcat(songs)

    /*
    const trimCommand = soxCommand()
      .input("./src/videoGeneration/Sounds/song1.mp3")
      .output("./src/videoGeneration/Sounds/trim.mp3")
      .trim(5, 35)
    trimCommand.on("prepare", function (args) {
      console.log("Preparing sox command with args " + args.join(" "))
    })

    trimCommand.on("start", function (commandLine) {
      console.log("Spawned sox with command " + commandLine)
    })

    trimCommand.on("progress", function (progress) {
      console.log("Processing progress: ", progress)
    })

    trimCommand.on("error", function (err, stdout, stderr) {
      console.log("Cannot process audio: " + err.message)
      console.log("Sox Command Stdout: ", stdout)
      console.log("Sox Command Stderr: ", stderr)
    })

    trimCommand.on("end", function () {
      console.log("Sox command succeeded!")
    })

    trimCommand.run()

     */
  }

  async audioConcat (songs: string[]) {
    await audioconcat(songs)
      .concat("./src/videoGeneration/Sounds/all.wav")
      .on("start", function (command) {
        console.log("ffmpeg process started:", command)
      })
      .on("error", function (err, stdout, stderr) {
        console.error("Error:", err)
        console.error("ffmpeg stderr:", stderr)
      })
      .on("end", function (output) {
        console.error("Audio created in:", output)
      })
  }

  /**
   *Workout service - Get Exercises Base 64
   *
   * @brief Function that accepts an exercise ID as a parameter and returns the list of poses associated with the exercise. If exercise doesn't exist, return -1.
   * @param id Exercise ID
   * @return  Re-formatted Array of base64 images.
   * @author Tinashe Chamisa
   *
   */
  async getExerciseBase64 (id: string) {
    const jsonTest = fs.readFileSync("./src/createdWorkoutImages.json", "utf8")
    const json = JSON.parse(jsonTest)
    const found = json.find(element => element.ID === id)
    return (typeof found !== "undefined") ? found.images : []
  }

  /**
   *Workout service - Get Exercises Descriptions
   *
   * @brief Function that accepts an exercise ID and retrieves the description
   * @param id Exercise ID
   * @return  Re-formatted An exercise description.
   * @author Tinashe Chamisa
   *
   */
  getExerciseDescription (id: string) {
    const jsonTest = fs.readFileSync("./src/createdWorkoutImages.json", "utf8")
    const json = JSON.parse(jsonTest)
    const found = json.find(element => element.ID === id)
    return (typeof found !== "undefined") ? found.poseDescription : ""
  }

  /**
   *Workout Controller - Get Workout Video
   *
   * @param workoutID  The workout ID
   * @param ctx  This is the prisma context that is injected into the function.
   * @throws ApiPreconditionFailedResponse if: -Invalid Workout ID passed in.
   * @throws NotFoundException if: -Workout video does not exist.
   * @throws BadRequestException if: - Cannot return workout video
   * @return  Base64 string of workout video.
   * @author Tinashe Chamisa
   *
   */
  async getWorkoutVideo (workoutID: string, ctx: Context): Promise<any> {
    if (workoutID == null || workoutID === "") {
      throw new PreconditionFailedException("Invalid Workout ID passed in.")
    }
    try {
      fs.readFile("./src/videoGeneration/Videos/" + workoutID + ".mp4", function (err, data) {
        if (err) throw err
      })
      /*
      const result = [""]
      for (let i = 0; i < fileData.length; i += 2) {
        if (i === 0) { result.shift() }
        result.push("0x" + fileData[i] + "" + fileData[i + 1])
      }
       */
      return fs.readFileSync("./src/videoGeneration/Videos/" + workoutID + ".mp4").toString("base64")
    } catch (E) {
      throw new BadRequestException("Cannot return video.")
    }
  }
}
