import {TestBed} from "@angular/core/testing";

import { WorkoutService } from "./workout.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Exercise} from "../../Models/exercise";
import {Workout} from "../../Models/workout";
import {IonicStorageModule} from "@ionic/storage-angular";

describe("WorkoutService", () => {
    let service: WorkoutService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, IonicStorageModule.forRoot()]
        });
        service = TestBed.inject(WorkoutService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(()=>{
        httpMock.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    // Create Exercise Unit Tests
    it("should create an exercise successfully because server responds with status code 200", async () => {

        const exercise: Exercise = new Exercise("Leg Killer", "A hard day for your legs", "6-8", 3, "None", 60, [], 8);
        const respStatus = service.attemptSubmitExercise(exercise);
        const req = httpMock.expectOne("http://localhost:3000/workout/createExercise");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            exerciseTitle: exercise.title,
            exerciseDescription: exercise.description,
            repRange: exercise.repRange,
            sets: exercise.sets,
            poseDescription: exercise.Posedescription,
            restPeriod: exercise.restPeriod,
            tags: exercise.tags,
            duration: exercise.duratime
        });

        const resp = new HttpResponse({
            status: 200
        });

        req.flush(resp);
        const status = await respStatus;
        expect(status).toEqual(200);
    });
    it("should fail to create an exercise because server responds with status code 400 (i.e. data is missing or invalid)", async () => {
        const exercise: Exercise = new Exercise("Leg Killer", "A hard day for your legs", null, 3, "None", 60, [], 8);
        const respStatus = service.attemptSubmitExercise(exercise);

        const req = httpMock.expectOne("http://localhost:3000/workout/createExercise");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            exerciseTitle: exercise.title,
            exerciseDescription: exercise.description,
            repRange: exercise.repRange,
            sets: exercise.sets,
            poseDescription: exercise.Posedescription,
            restPeriod: exercise.restPeriod,
            tags: exercise.tags,
            duration: exercise.duratime
        });

        const resp = new HttpErrorResponse({
            status: 400
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(400);
    });
    it("should fail to create an exercise because server does not respond and returns status 0 which should be translated to 500", async () => {
        const exercise: Exercise = new Exercise("Leg Killer", "A hard day for your legs", null, 3, "None", 60, [], 8);
        const respStatus = service.attemptSubmitExercise(exercise);

        const req = httpMock.expectOne("http://localhost:3000/workout/createExercise");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            exerciseTitle: exercise.title,
            exerciseDescription: exercise.description,
            repRange: exercise.repRange,
            sets: exercise.sets,
            poseDescription: exercise.Posedescription,
            restPeriod: exercise.restPeriod,
            tags: exercise.tags,
            duration: exercise.duratime
        });

        const resp = new HttpErrorResponse({
            status: 0
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(500);
    });
    it("should fail to create an exercise because server responds with unknown status which should be translated to 500", async () => {
        const exercise: Exercise = new Exercise("Leg Killer", "A hard day for your legs", null, 3, "None", 60, [], 8);
        const respStatus = service.attemptSubmitExercise(exercise);

        const req = httpMock.expectOne("http://localhost:3000/workout/createExercise");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            exerciseTitle: exercise.title,
            exerciseDescription: exercise.description,
            repRange: exercise.repRange,
            sets: exercise.sets,
            poseDescription: exercise.Posedescription,
            restPeriod: exercise.restPeriod,
            tags: exercise.tags,
            duration: exercise.duratime
        });

        const resp = new HttpErrorResponse({
            status: 493
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(493);
    });

    // Create Workout Unit Tests
    it("should create a workout successfully because server responds with status code 200", async () => {
        const workout: Workout = new Workout("Leg Killer", "A hard day for your legs", []);
        const respStatus = service.attemptSubmitWorkout(workout);

        const req = httpMock.expectOne("http://localhost:3000/workout/createWorkout");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            workoutTitle: workout.title,
            workoutDescription: workout.description,
            exercises:workout.exercises
        });

        const resp = new HttpResponse({
            status: 200
        });
        req.flush(resp);

        const status = await respStatus;
        expect(status).toEqual(200);
    });
    it("should fail to create a workout because server responds with status code 400 (i.e. data is missing or invalid)", async () => {
        const workout: Workout = new Workout("Leg Killer", null, []);
        const respStatus = service.attemptSubmitWorkout(workout);

        const req = httpMock.expectOne("http://localhost:3000/workout/createWorkout");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            workoutTitle: workout.title,
            workoutDescription: workout.description,
            exercises:workout.exercises
        });

        const resp = new HttpErrorResponse({
            status: 400
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(400);
    });
    it("should fail to create a workout because server does not respond and returns status 0 which should be translated to 500", async () => {
        const workout: Workout = new Workout("Leg Killer", null, []);
        const respStatus = service.attemptSubmitWorkout(workout);

        const req = httpMock.expectOne("http://localhost:3000/workout/createWorkout");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            workoutTitle: workout.title,
            workoutDescription: workout.description,
            exercises:workout.exercises
        });

        const resp = new HttpErrorResponse({
            status: 0
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(500);
    });
    it("should fail to create a workout because server responds with unknown status which should be translated to 500", async () => {
        const workout: Workout = new Workout("Leg Killer", "A test for the legs", []);
        const respStatus = service.attemptSubmitWorkout(workout);

        const req = httpMock.expectOne("http://localhost:3000/workout/createWorkout");
        expect(req.request.method).toEqual("POST");
        expect(req.request.body).toEqual({
            workoutTitle: workout.title,
            workoutDescription: workout.description,
            exercises:workout.exercises
        });

        const resp = new HttpErrorResponse({
            status: 493
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(493);
    });

    // Update Workout Unit Tests
    it("should update a workout successfully because server responds with status code 200", async () => {
        const workout: Workout = new Workout("Leg Killer", "A hard day for your legs", []);
        const respStatus = service.attemptUpdateWorkout(workout, "A VALID ID");
        const req = httpMock.expectOne("http://localhost:3000/workout/updateWorkout");
        expect(req.request.method).toEqual("PUT");
        expect(req.request.body).toEqual({
            workoutID:"A VALID ID",
            workoutTitle: workout.title,
            workoutDescription: workout.description,
            exercises:workout.exercises
        });

        const resp = new HttpResponse({
            status: 200
        });
        req.flush(resp);

        const status = await respStatus;
        expect(status).toEqual(200);
    });
    it("should fail to update a workout because server responds with status code 400 (i.e. data is missing or invalid)", async () => {
        const workout: Workout = new Workout("Leg Killer", null, []);
        const respStatus = service.attemptUpdateWorkout(workout, "A VALID ID");
        const req = httpMock.expectOne("http://localhost:3000/workout/updateWorkout");
        expect(req.request.method).toEqual("PUT");
        expect(req.request.body).toEqual({
            workoutID:"A VALID ID",
            workoutTitle: workout.title,
            workoutDescription: workout.description,
            exercises:workout.exercises
        });

        const resp = new HttpErrorResponse({
            status: 400
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(400);
    });
    it("should fail to update a workout because server does not respond and returns status 0 which should be translated to 500", async () => {
        const workout: Workout = new Workout("Leg Killer", null, []);
        const respStatus = service.attemptUpdateWorkout(workout, "A VALID ID");
        const req = httpMock.expectOne("http://localhost:3000/workout/updateWorkout");
        expect(req.request.method).toEqual("PUT");
        expect(req.request.body).toEqual({
            workoutID:"A VALID ID",
            workoutTitle: workout.title,
            workoutDescription: workout.description,
            exercises:workout.exercises
        });

        const resp = new HttpErrorResponse({
            status: 0
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(500);
    });
    it("should fail to update a workout because server responds with unknown status which should be translated to 500", async () => {
        const workout: Workout = new Workout("Leg Killer", "A test for the legs", []);
        const respStatus = service.attemptUpdateWorkout(workout, "A VALID ID");
        const req = httpMock.expectOne("http://localhost:3000/workout/updateWorkout");
        expect(req.request.method).toEqual("PUT");
        expect(req.request.body).toEqual({
            workoutID:"A VALID ID",
            workoutTitle: workout.title,
            workoutDescription: workout.description,
            exercises:workout.exercises
        });

        const resp = new HttpErrorResponse({
            status: 493
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(493);
    });

    // Update Exercise Unit Tests
    it("should update an exercise successfully because server responds with status code 200", async () => {

        const exercise: Exercise = new Exercise("Leg Killer", "A hard day for your legs", "6-8", 3, "None", 60, [], 8);
        const respStatus = service.attemptUpdateExercise(exercise, "A VALID ID");
        const req = httpMock.expectOne("http://localhost:3000/workout/updateExercise");
        expect(req.request.method).toEqual("PUT");
        expect(req.request.body).toEqual({
            exerciseID : "A VALID ID",
            exerciseTitle: exercise.title,
            exerciseDescription: exercise.description,
            repRange: exercise.repRange,
            sets: exercise.sets,
            poseDescription: exercise.Posedescription,
            restPeriod: exercise.restPeriod,
            tags: exercise.tags,
            duration: exercise.duratime
        });

        const resp = new HttpResponse({
            status: 200
        });

        req.flush(resp);
        const status = await respStatus;
        expect(status).toEqual(200);
    });
    it("should fail to update an exercise because server responds with status code 400 (i.e. data is missing or invalid)", async () => {
        const exercise: Exercise = new Exercise("Leg Killer", "A hard day for your legs", null, 3, "None", 60, [], 8);

        const respStatus = service.attemptUpdateExercise(exercise, "A VALID ID");
        const req = httpMock.expectOne("http://localhost:3000/workout/updateExercise");
        expect(req.request.method).toEqual("PUT");
        expect(req.request.body).toEqual({
            exerciseID : "A VALID ID",
            exerciseTitle: exercise.title,
            exerciseDescription: exercise.description,
            repRange: exercise.repRange,
            sets: exercise.sets,
            poseDescription: exercise.Posedescription,
            restPeriod: exercise.restPeriod,
            tags: exercise.tags,
            duration: exercise.duratime
        });

        const resp = new HttpErrorResponse({
            status: 400
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(400);
    });
    it("should fail to update an exercise because server does not respond and returns status 0 which should be translated to 500", async () => {
        const exercise: Exercise = new Exercise("Leg Killer", "A hard day for your legs", null, 3, "None", 60, [], 8);
        const respStatus = service.attemptUpdateExercise(exercise, "A VALID ID");
        const req = httpMock.expectOne("http://localhost:3000/workout/updateExercise");
        expect(req.request.method).toEqual("PUT");
        expect(req.request.body).toEqual({
            exerciseID : "A VALID ID",
            exerciseTitle: exercise.title,
            exerciseDescription: exercise.description,
            repRange: exercise.repRange,
            sets: exercise.sets,
            poseDescription: exercise.Posedescription,
            restPeriod: exercise.restPeriod,
            tags: exercise.tags,
            duration: exercise.duratime
        });

        const resp = new HttpErrorResponse({
            status: 0
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(500);
    });
    it("should fail to update an exercise because server responds with unknown status which should be translated to 500", async () => {
        const exercise: Exercise = new Exercise("Leg Killer", "A hard day for your legs", null, 3, "None", 60, [], 8);
        const respStatus = service.attemptUpdateExercise(exercise, "A VALID ID");
        const req = httpMock.expectOne("http://localhost:3000/workout/updateExercise");
        expect(req.request.method).toEqual("PUT");
        expect(req.request.body).toEqual({
            exerciseID : "A VALID ID",
            exerciseTitle: exercise.title,
            exerciseDescription: exercise.description,
            repRange: exercise.repRange,
            sets: exercise.sets,
            poseDescription: exercise.Posedescription,
            restPeriod: exercise.restPeriod,
            tags: exercise.tags,
            duration: exercise.duratime
        });

        const resp = new HttpErrorResponse({
            status: 493
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(493);
    });

    // Remove Workout Unit Tests
    it("should remove an exercise successfully because server responds with status code 200", async () => {
        const respStatus = service.attemptRemoveExercise("A VALID ID");
        const req = httpMock.expectOne("http://localhost:3000/workout/deleteExercise");
        expect(req.request.method).toEqual("DELETE");
        expect(req.request.body).toEqual({
            exerciseID : "A VALID ID"
        });

        const resp = new HttpResponse({
            status: 200
        });

        req.flush(resp);
        const status = await respStatus;
        expect(status).toEqual(200);
    });
    it("should fail to remove an exercise because server responds with status code 400 (i.e. data is missing or invalid)", async () => {
        const respStatus = service.attemptRemoveExercise("AN INVALID ID");
        const req = httpMock.expectOne("http://localhost:3000/workout/deleteExercise");
        expect(req.request.method).toEqual("DELETE");
        expect(req.request.body).toEqual({
            exerciseID : "AN INVALID ID"
        });

        const resp = new HttpErrorResponse({
            status: 400
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(400);
    });
    it("should fail to remove an exercise because server does not respond and returns status 0 which should be translated to 500", async () => {
        const respStatus = service.attemptRemoveExercise("AN INVALID ID");
        const req = httpMock.expectOne("http://localhost:3000/workout/deleteExercise");
        expect(req.request.method).toEqual("DELETE");
        expect(req.request.body).toEqual({
            exerciseID : "AN INVALID ID"
        });

        const resp = new HttpErrorResponse({
            status: 0
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(500);
    });
    it("should fail to remove an exercise because server responds with unknown status which should be translated to 500", async () => {
        const respStatus = service.attemptRemoveExercise("AN INVALID ID");
        const req = httpMock.expectOne("http://localhost:3000/workout/deleteExercise");
        expect(req.request.method).toEqual("DELETE");
        expect(req.request.body).toEqual({
            exerciseID : "AN INVALID ID"
        });

        const resp = new HttpErrorResponse({
            status: 493
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(493);
    });

    // Remove Exercise Unit Tests
    it("should remove a workout successfully because server responds with status code 200", async () => {
        const respStatus = service.attemptRemoveWorkout("A VALID ID");
        const req = httpMock.expectOne("http://localhost:3000/workout/deleteWorkout");
        expect(req.request.method).toEqual("DELETE");
        expect(req.request.body).toEqual({
            workoutID : "A VALID ID"
        });

        const resp = new HttpResponse({
            status: 200
        });

        req.flush(resp);
        const status = await respStatus;
        expect(status).toEqual(200);
    });
    it("should fail to remove a workout because server responds with status code 400 (i.e. data is missing or invalid)", async () => {
        const respStatus = service.attemptRemoveWorkout("AN INVALID ID");
        const req = httpMock.expectOne("http://localhost:3000/workout/deleteWorkout");
        expect(req.request.method).toEqual("DELETE");
        expect(req.request.body).toEqual({
            workoutID : "AN INVALID ID"
        });

        const resp = new HttpErrorResponse({
            status: 400
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(400);
    });
    it("should fail to remove a workout because server does not respond and returns status 0 which should be translated to 500", async () => {
        const respStatus = service.attemptRemoveWorkout("AN INVALID ID");
        const req = httpMock.expectOne("http://localhost:3000/workout/deleteWorkout");
        expect(req.request.method).toEqual("DELETE");
        expect(req.request.body).toEqual({
            workoutID : "AN INVALID ID"
        });

        const resp = new HttpErrorResponse({
            status: 0
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(500);
    });
    it("should fail to remove a workout because server responds with unknown status which should be translated to 500", async () => {
        const respStatus = service.attemptRemoveWorkout("AN INVALID ID");
        const req = httpMock.expectOne("http://localhost:3000/workout/deleteWorkout");
        expect(req.request.method).toEqual("DELETE");
        expect(req.request.body).toEqual({
            workoutID : "AN INVALID ID"
        });

        const resp = new HttpErrorResponse({
            status: 493
        });
        req.flush(null, resp);

        const status = await respStatus;
        expect(status).toEqual(493);
    });

    // Get Tags Unit Tests
    it("should get all tags in the database", async ()=>{
        const tags = service.getTags();

        const req = httpMock.expectOne("http://localhost:3000/workout/getTags");
        expect(req.request.method).toEqual("GET");

        const resp = new HttpResponse({
            status: 200,
            body:
        [
            {
                label: "Add One",
                textColour: "RED",
                backgroundColour: "YELLOW"
            },
            {
                label: "Thighs",
                textColour: "BLACK",
                backgroundColour: "PINK"
            },
            {
                label: "Zel",
                textColour: "YELLOW",
                backgroundColour: "ORANGE"
            }
        ]
        });
        req.flush(resp);
        const actualResp = await tags;
        expect(resp.body).toEqual(actualResp.data.body);
    });

    /**
     * Getting all the workouts
     */
    it("should obtain all the workouts and return a 200 status", async () => {

        const respStatus = service.attemptGetWorkouts();

        const req = httpMock.expectOne("http://localhost:3000/workout/getWorkouts");
        expect(req.request.method).toEqual("GET");

        const resp = new HttpResponse({
            status: 200,
            statusText: "Workouts obtained"
        });
        req.flush(resp);
        const status = await respStatus;
        const statusValue: number = status["status"];
        expect(statusValue).toEqual(200);
    });
    it("should fail to get all workouts because none exist in the database", async ()=>{
        const respStatus = service.attemptGetWorkouts();

        const req = httpMock.expectOne("http://localhost:3000/workout/getWorkouts");
        expect(req.request.method).toEqual("GET");

        const resp = new HttpErrorResponse({
            status: 404,
            statusText: "No workouts were found in the database",
        });
        req.flush(null, resp);
        const status = await respStatus;
        const statusValue: number = status["status"];
        expect(statusValue).toEqual(404);
    });
    it("should fail to obtain the workouts because server does not respond and returns status 500", async () => {
        const respStatus = service.attemptGetWorkouts();
        const req = httpMock.expectOne("http://localhost:3000/workout/getWorkouts");
        expect(req.request.method).toEqual("GET");

        const resp = new HttpErrorResponse({
            status: 500,
            statusText: "Server not responding."
        });
        req.flush(null, resp);
        const status = await respStatus;
        const statusValue: number = status["status"];
        expect(statusValue).toEqual(500);
    });

    /**
     * Getting all the exercises
     */
    it("should obtain all the exercises and return a 200 status", async () => {

        const respStatus = service.attemptGetExercises();

        const req = httpMock.expectOne("http://localhost:3000/workout/getExercises");
        expect(req.request.method).toEqual("GET");

        const resp = new HttpResponse({
            status: 200,
            statusText: "Exercises obtained"
        });
        req.flush(resp);
        const status = await respStatus;
        const statusValue: number = status["status"];
        expect(statusValue).toEqual(200);
    });
    it("should fail to get all exercises because none exist in the database", async ()=>{
        const respStatus = service.attemptGetExercises();

        const req = httpMock.expectOne("http://localhost:3000/workout/getExercises");
        expect(req.request.method).toEqual("GET");

        const resp = new HttpErrorResponse({
            status: 404,
            statusText: "No exercises were found in the database",
        });
        req.flush(null, resp);
        const status = await respStatus;
        const statusValue: number = status["status"];
        expect(statusValue).toEqual(404);
    });
    it("should fail to obtain the exercises because server does not respond and returns status 500", async () => {
        const respStatus = service.attemptGetWorkouts();
        const req = httpMock.expectOne("http://localhost:3000/workout/getWorkouts");
        expect(req.request.method).toEqual("GET");

        const resp = new HttpErrorResponse({
            status: 500,
            statusText: "Server not responding."
        });
        req.flush(null, resp);
        const status = await respStatus;
        const statusValue: number = status["status"];
        expect(statusValue).toEqual(500);
    });

    /**
     * Getting all the workouts by planner
     */
    it("should obtain all the workouts for the planner that is logged in and return a 200 status", async () => {

        const respStatus = service.attemptGetWorkoutsByPlanner();

        const req = httpMock.expectOne("http://localhost:3000/workout/getWorkoutByPlanner");
        expect(req.request.method).toEqual("GET");

        const resp = new HttpResponse({
            status: 200,
            statusText: "Exercises obtained"
        });
        req.flush(resp);
        const status = await respStatus;
        const statusValue: number = status["status"];
        expect(statusValue).toEqual(200);
    });
    it("should fail to get all workouts for the planner that is logged in because none exist in the database", async ()=>{
        const respStatus = service.attemptGetWorkoutsByPlanner();

        const req = httpMock.expectOne("http://localhost:3000/workout/getWorkoutByPlanner");
        expect(req.request.method).toEqual("GET");

        const resp = new HttpErrorResponse({
            status: 404,
            statusText: "No exercises were found in the database",
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(404);
    });
    it("should fail to get all workouts for the planner that is logged in because server does not respond and returns status 500", async () => {
        const respStatus = service.attemptGetWorkoutsByPlanner();
        const req = httpMock.expectOne("http://localhost:3000/workout/getWorkoutByPlanner");
        expect(req.request.method).toEqual("GET");

        const resp = new HttpErrorResponse({
            status: 500,
            statusText: "Server not responding."
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(500);
    });

    /**
     * Getting all the exercises by planner
     */
    it("should obtain all the exercises for the planner that is logged in and return a 200 status", async () => {

        const respStatus = service.attemptGetExercisesByPlanner();

        const req = httpMock.expectOne("http://localhost:3000/workout/getExercisesByPlanner");
        expect(req.request.method).toEqual("GET");

        const resp = new HttpResponse({
            status: 200,
            statusText: "Exercises obtained"
        });
        req.flush(resp);
        const status = await respStatus;
        const statusValue: number = status["status"];
        expect(statusValue).toEqual(200);
    });
    it("should fail to get all exercises for the planner that is logged in because none exist in the database", async ()=>{
        const respStatus = service.attemptGetExercisesByPlanner();

        const req = httpMock.expectOne("http://localhost:3000/workout/getExercisesByPlanner");
        expect(req.request.method).toEqual("GET");

        const resp = new HttpErrorResponse({
            status: 404,
            statusText: "No exercises were found in the database",
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(404);
    });
    it("should fail to get all exercises for the planner that is logged in because server does not respond and returns status 500", async () => {
        const respStatus = service.attemptGetExercisesByPlanner();

        const req = httpMock.expectOne("http://localhost:3000/workout/getExercisesByPlanner");
        expect(req.request.method).toEqual("GET");

        const resp = new HttpErrorResponse({
            status: 500,
            statusText: "Server not responding."
        });
        req.flush(null, resp);
        const status = await respStatus;
        expect(status).toEqual(500);
    });
});
