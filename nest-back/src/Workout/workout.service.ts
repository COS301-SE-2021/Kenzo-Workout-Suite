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
const MP3Cutter = require("mp3-cutter")
// const soxCommand = require("sox-audio")

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
        const image = await this.convertImageBase64(exercises[i])
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
        const image = await this.convertImageBase64(exercise[i])
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

        const image = await this.convertImageBase64(exercise)
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
          const image = await this.convertImageBase64(exercise[i])
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
      await this.saveExerciseImages(exerciseDetails, images, "./src/ExerciseImages/")
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
      await this.saveExerciseImages(exerciseDetails, images, "./src/ExerciseImages/")
      await this.saveImagesToJSON(exerciseDetails, images)
      return ("Exercise created.")
    }
  }

  /**
   *Workout Service - Save images to JSOn
   *
   * @param exercise This is the ID of the exercise.
   * @param images String array of base64 images to use for workout
   * @throws PreconditionFailedException if:
   *                               -Not all parameters are given.
   * @throws NotFoundException if:
   *                               -An exercise with provided ID does not exist.
   * @author Msi Sibanyoni
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
   *Workout Service - Save exercise images
   *
   * @param exercise This is the exercise object of the exercise.
   * @param images String array of base64 images to use for workout
   * @param path String path of where to save the images
   * @throws PreconditionFailedException if:
   *                               -Not all parameters are given.
   * @throws NotFoundException if:
   *                               -An exercise with provided ID does not exist.
   * @author Msi Sibanyoni
   *
   */
  async saveExerciseImages (exercise: any, images : string[], path : string) {
    if (exercise == null || images == null || path == null || path === "") {
      throw new PreconditionFailedException("Not all parameters have been provided!")
    }
    // const path = "./src/ExerciseImages"
    for (let j = 0; j < images.length; j++) {
      const fileName = "I-" + exercise.exerciseID + "-" + (j + 1)
      // eslint-disable-next-line no-useless-catch
      try {
        const optionalObj = { fileName, type: "jpg" }
        await base64ToImage(images[j], path, optionalObj)
      } catch (e) { throw e }
    }
  }

  /**
   *Workout Service - Get exercise images
   *
   * @param exercise This is the exercise object of the exercise which images one wishes to retrieve.
   * @param path String path of where to retrieve the images
   * @throws PreconditionFailedException if:
   *                               -Not all parameters are given.
   * @throws NotFoundException if:
   *                               -An exercise with provided ID does not exist.
   * @author Msi Sibanyoni
   *
   */
  async getExerciseImages (exercise: any, path : string) {
    if (exercise == null || path == null || path === "") {
      throw new PreconditionFailedException("Not all parameters have been provided!")
    }
    const imageArray:any = []
    let imageCounter = 1
    while (imageCounter < 5) {
      const imagePath = path + "I-" + exercise.exerciseID + "-" + imageCounter + ".jpg"
      if (fs.existsSync(imagePath)) {
        imageArray.push(imagePath)
      }
      imageCounter += 1
    }
    return imageArray
  }

  /**
   *Workout Controller - Convert Image Base64
   *
   * @description Helper function for Exercise getters to convert jpeg to base64 strings
   * @exercise An exercise object
   * @return An array of base64 strings
   *
   * @author Tinashe Chamisa
   *
   */
  async convertImageBase64 (exercise: any) {
    const paths: string[] = await this.getExerciseImages(exercise, "./src/ExerciseImages/")
    const base64Images: string[] = []
    for (let i = 0; i < paths.length; i++) {
      base64Images.push("data:image/jpeg;base64," + fs.readFileSync(paths[i], "base64"))
    }
    return base64Images
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
          await this.saveExerciseImages(exerciseDetails, images, "./src/ExerciseImages/")
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
          await this.saveExerciseImages(exerciseDetails, images, "./src/ExerciseImages/")
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
  async deleteExercise (exercise: string, ctx: Context): Promise<any> {
    if (exercise === "") {
      throw new PreconditionFailedException("Parameter can not be left empty.")
    }
    try {
      const exerciseImageArray = await this.getExerciseImages(await this.getExerciseByID(exercise, ctx), "./src/ExerciseImages/")
      await ctx.prisma.exercise.delete({
        where: {
          exerciseID: exercise
        }
      })
      for (let i = 0; i < exerciseImageArray.length; i++) {
        fs.unlink(exerciseImageArray[i], (err) => {
          if (err) {
            throw err
          }
        })
      }
      await this.cleanupWorkouts(ctx)
      return ("Exercise Deleted.")
    } catch (e) {
      throw new NotFoundException("Exercise with provided ID does not exist")
    }
  }

  /**
   *Workout Service - CleanupWorkouts
   *
   * @throws NotFoundException if:
   *                               -There are no workouts.
   * @author Msi Sibanyoni
   *
   */

  async cleanupWorkouts (ctx: Context) {
    try {
      const allWorkouts = await this.getWorkouts(ctx)
      for (let i = 0; i < allWorkouts.length; i++) {
        if (allWorkouts[i].exercises.length === 0 || allWorkouts[i].exercises === []) {
          await this.deleteWorkout(allWorkouts[i].workoutID, ctx)
        }
      }
    } catch {
      throw new NotFoundException("No workouts found in database.")
    }
  }

  /**
   *Workout Service - Create Workout
   *
   * @param workoutTitle This is the string workout title
   * @param workoutDescription This is the string workout description
   * @param exercises This is an array of exercises
   * @param loop Duration each each exercise pose in seconds
   * @param songChoice Genre choice for background track
   * @param resolutionWidth The width of the resolution
   * @param resolutionHeight The height of the resolution
   * @param plannerID This is the string planner ID
   * @param ctx  This is the prisma context that is injected into the function.
   * @throws PreconditionFailedException if:
   *                               -Parameters can not be left empty.
   * @throws BadRequestException if:
   *                        -Cannot create workout
   * @return  Message indicating success.
   * @author Msi Sibanyoni
   *
   */
  async createWorkout (workoutTitle: string, workoutDescription: string, exercises : Exercise[], loop: number, songChoice: string, resolutionWidth: number, resolutionHeight: number, plannerID :string, ctx: Context) {
    if (workoutTitle === "" || workoutDescription === "" || plannerID === "" || loop === 0 || songChoice === "" || resolutionWidth === 0 || resolutionHeight === 0 || exercises == null || workoutTitle == null || workoutDescription == null || songChoice === null || plannerID == null || !(Array.isArray(exercises) && exercises.length)) {
      throw new NotFoundException("Parameters can not be left empty.")
    }
    try { // run create query with exercises only
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
      await this.createVideo(fullWorkout.workoutID, loop, songChoice, resolutionWidth, resolutionHeight, ctx)
      return ("Workout Created.")
    } catch {
      throw new BadRequestException("Cannot create workout.")
    }
  }

  /**
   *Workout Service - Update Workout
   *
   * @param workoutID this is the string ID of the workout to be updated
   * @param workoutTitle This is the string workout title
   * @param workoutDescription This is the string workout description
   * @param exercises This is an array of exercises
   * @param loop Duration each each exercise pose in seconds
   * @param songChoice Genre choice for background track
   * @param resolutionWidth The width of the resolution
   * @param resolutionHeight The height of the resolution
   * @param plannerID This is the string planner ID
   * @param ctx  This is the prisma context that is injected into the function.
   * @throws PreconditionFailedException if:
   *                               -Parameters can not be left empty.
   *
   * @return  Message indicating success.
   * @author Msi Sibanyoni
   *
   */
  async updateWorkout (workoutID: string, workoutTitle: string, workoutDescription: string, exercises : Exercise[], loop: number, songChoice: string, resolutionWidth: number, resolutionHeight: number, plannerID :string, ctx: Context) {
    if (workoutTitle === "" || workoutDescription === "" || plannerID === "" || loop === 0 || songChoice === "" || resolutionWidth === 0 || resolutionHeight === 0 || exercises == null || workoutTitle == null || workoutDescription == null || songChoice === null || plannerID == null || !(Array.isArray(exercises) && exercises.length)) {
      throw new NotFoundException("Parameters can not be left empty.")
    }
    try { // run create query with exercises only
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
        await this.createVideo(updatedWorkout.workoutID, loop, songChoice, resolutionWidth, resolutionHeight, ctx)
        return ("Workout Updated.")
      } catch (e) {
        throw new NotFoundException("Workout with provided ID does not exist")
      }
    } catch {
      throw new BadRequestException("Cannot create workout.")
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
      fs.unlink("./src/GeneratedWorkouts/" + workoutID + ".pdf", (err) => {
        // eslint-disable-next-line no-empty
        if (err) {
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
    const form = pdfDoc.getForm()
    try {
      const titleField = form.createTextField("workout.Title")
      titleField.enableMultiline()
      titleField.enableReadOnly()
      titleField.setText(workout.workoutTitle)
      if (workout.workoutTitle.length <= 12) {
        titleField.addToPage(firstPage, {
          x: 300,
          y: 140,
          width: 280,
          height: 50,
          borderWidth: 0
        })
        form.getTextField("workout.Title").setFontSize(36)
      } else {
        titleField.addToPage(firstPage, {
          x: 300,
          y: 190,
          width: 280,
          height: 90,
          borderWidth: 0
        })
        if (workout.workoutTitle.length > 13 && workout.workoutTitle.length <= 32) {
          form.getTextField("workout.Title").setFontSize(26)
        } else {
          form.getTextField("workout.Title").setFontSize(24)
        }
      }
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
          currentPage.drawText("Exercise Description:", {
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
          currentPage.drawText("Rep Range: ", {
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
          currentPage.drawText("Sets: ", {
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
          currentPage.drawText("Rest Period: ", {
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
          currentPage.drawText("Exercise Duration: ", {
            x: 20,
            y: 540,
            size: 12,
            font: SFBold,
            color: fieldsHeadingColour
          })
          let duration = "Consult Personal Trainer."
          if (workout.exercises[i].duration !== null) {
            duration = (workout.exercises[i].duration / 60).toString() + "minutes."
          }
          currentPage.drawText(duration, {
            x: 130,
            y: 540,
            size: 12,
            font: SFRegular
          })
          // Planner
          currentPage.drawText("Planner: ", {
            x: 20,
            y: 510,
            size: 12,
            font: SFBold,
            color: fieldsHeadingColour
          })
          currentPage.drawText(userFirstLastName.toString(), {
            x: 130,
            y: 510,
            size: 12,
            font: SFRegular
          })
          // Images
          const exerciseImageArray = await this.getExerciseImages(workout.exercises[i], "./src/ExerciseImages/")
          if (exerciseImageArray !== undefined || exerciseImageArray !== []) {
            for (let c = 0; c < exerciseImageArray.length; c++) {
              const uint8Array = fs.readFileSync(exerciseImageArray[c])
              const currentImage = await pdfDoc.embedJpg(uint8Array)
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
          currentPage.drawText("Exercise Description:", {
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
          currentPage.drawText("Rep Range: ", {
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
          currentPage.drawText("Sets ", {
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
          currentPage.drawText("Exercise Duration: ", {
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
          currentPage.drawText("Planner: ", {
            x: 20,
            y: 130,
            size: 12,
            font: SFBold,
            color: fieldsHeadingColour
          })
          currentPage.drawText(userFirstLastName.toString(), {
            x: 130,
            y: 130,
            size: 12,
            font: SFRegular
          })
          // Images
          const exerciseImageArray = await this.getExerciseImages(workout.exercises[i], "./src/ExerciseImages/")
          if (exerciseImageArray !== undefined || exerciseImageArray !== []) {
            for (let c = 0; c < exerciseImageArray.length; c++) {
              const uint8Array = fs.readFileSync(exerciseImageArray[c])
              const currentImage = await pdfDoc.embedJpg(uint8Array)
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
      throw new NotAcceptableException("Workout ID cannot be empty.")
    }
    let workoutObject
    let uint8ArrayFP
    let pdfDoc
    try {
      workoutObject = await this.getWorkoutById(workoutID, ctx)
    } catch (E) {
      throw new BadRequestException("Provided workout does not exist!")
    }

    try {
      uint8ArrayFP = fs.readFileSync("./src/GeneratedWorkouts/" + workoutObject.workoutID + ".pdf")
    } catch {
      await this.generatePrettyWorkoutPDF(workoutObject, ctx)
      uint8ArrayFP = fs.readFileSync("./src/GeneratedWorkouts/" + workoutObject.workoutID + ".pdf")
    } finally {
      pdfDoc = await PDFDocument.load(uint8ArrayFP)
    }
    return await pdfDoc.saveAsBase64({ dataUri: true })
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
   * @param loop Duration each each exercise pose in seconds
   * @param songChoice Genre choice for background track
   * @param resolutionWidth The width of the resolution
   * @param resolutionHeight The height of the resolution
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
  async createVideo (workoutID: string, loop: number, songChoice: string, resolutionWidth: number, resolutionHeight: number, ctx: Context): Promise<any> {
    if (workoutID == null || workoutID === "") {
      throw new PreconditionFailedException("Invalid Workout ID passed in.")
    }
    const exercises: any[] = []
    // eslint-disable-next-line no-useless-catch
    try {
      const workout = await this.getWorkoutById(workoutID, ctx)
      if (workout === null) { // if JSON object is empty, send error code
        throw new NotFoundException("No workout was found in the database with the specified workout ID.")
      } else {
        workout.exercises.forEach(element => {
          // console.log(element)
          exercises.push(element)
        })
      }
    } catch (err) {
      throw err
    }

    if (exercises.length === 0) {
      throw new BadRequestException("Cant create video without exercises")
    }

    interface IMAGE {
      path: string,
      caption: string,
      loop: number
    }

    const images: IMAGE[] = []
    const subtitles: string[] = []
    const numberOfTimes: number[] = []
    let count = 0
    let fileNames: string[]
    let lengthOfVideo = 0

    // customization options
    const resolution = resolutionWidth + "x" + resolutionHeight

    // retrieve all exercises poses one by one from the local storage
    for (let i = 0; i < exercises.length; i++) {
      subtitles.push(exercises[i].exerciseDescription)
      fileNames = await this.getExerciseImages(exercises[i], "./src/ExerciseImages/")
      for (let k = 0; k < fileNames.length; k++) {
        images.push({
          path: fileNames[k],
          caption: exercises[i].exerciseDescription,
          loop: loop
        })
      }
      count += 1
      lengthOfVideo += loop

      if (exercises[i].length !== 1 && i < exercises[i].length - 1) {
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
      numberOfTimes.push(count)
      count = 0
      lengthOfVideo += 5
    }
    const videoOptions = {
      fps: 25,
      loop: lengthOfVideo, // length of video in seconds
      transition: true,
      transitionDuration: 1, // seconds
      videoBitrate: 1024,
      videoCodec: "libx264",
      size: resolution,
      audioBitrate: "128k",
      audioChannels: 2,
      format: "mp4",
      pixelFormat: "yuv420p"
    }

    // console.log(images)
    // eslint-disable-next-line no-useless-catch
    try {
      videoshow(images, videoOptions)
        .audio("./src/videoGeneration/Sounds/" + songChoice + ".mp3")
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
    } catch (e) { throw e }
  }

  /**
   *Workout Controller - Mix Audio
   *
   * @description Helper function for createVideo. Merges tts with audio soundtrack
   * @param subtitles  The workout exercises description
   * @param numberOfTimes  The number of times of pose needs to loop
   * @param loop Duration each each exercise pose in seconds
   * @param songChoice Genre choice for background track
   * @author Tinashe Chamisa
   *
   */
  async mixAudio (subtitles: string[], numberOfTimes:number[], loop: number, songChoice: string): Promise<any> {
    const songs: string[] = []
    const finalTimeline: string[] = []
    // create tts
    for (let i = 0; i < subtitles.length; i++) {
      await this.textToSpeech(subtitles[i], "exercise1Pose" + (i + 1))
      songs.push("./src/Workout/GeneratedTextSpeech/exercise1Pose" + (i + 1) + ".mp3")
    }
    // trim song choice
    if (songChoice === "hardcore") {
      await MP3Cutter.cut({
        src: "./src/videoGeneration/Sounds/" + songChoice + ".mp3",
        target: "./src/videoGeneration/Sounds/trim.mp3",
        start: 53,
        end: loop + 53
      })
    } else {
      await MP3Cutter.cut({
        src: "./src/videoGeneration/Sounds/" + songChoice + ".mp3",
        target: "./src/videoGeneration/Sounds/trim.mp3",
        start: 0,
        end: loop
      })
    }
    // create final timeline
    for (let j = 0; j < songs.length; j++) {
      for (let k = 0; k < numberOfTimes[j]; k++) {
        finalTimeline.push(songs[j])
      }
      finalTimeline.push("./src/videoGeneration/Sounds/trim.mp3")
    }
    console.log(finalTimeline)

    try {
      await this.audioConcat(finalTimeline)
    } catch (e) { console.log(e) }
  }

  /**
   *Workout Controller - Mix Audio
   *
   * @description Helper function for createVideo. Merges tts with audio soundtrack
   * @param songs  An array of audio files for concatenation using audioconcat
   * @author Tinashe Chamisa
   *
   */
  async audioConcat (songs: string[]) {
    await audioconcat(songs)
      .concat("./src/videoGeneration/Sounds/final.mp3")
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
