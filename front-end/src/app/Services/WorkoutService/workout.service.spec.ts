import { TestBed } from '@angular/core/testing';

import { WorkoutService } from './workout.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Exercise} from "../../Models/exercise";
import {Workout} from "../../Models/workout";
import {Storage} from "@ionic/storage";
import {IonicStorageModule} from "@ionic/storage-angular";
import {UserService} from "../UserService/user.service";

describe('WorkoutService', () => {
  let service: WorkoutService;
  let userService: UserService;
  let httpMock:HttpTestingController;
  let httpClient:HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, IonicStorageModule.forRoot()]
    });
    service = TestBed.inject(WorkoutService);
    userService = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(()=>{
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Create Exercise Unit Tests
  it("should create an exercise successfully because server responds with status code 200", async () => {
    spyOn(userService, "getToken").and.resolveTo(JSON.parse('{"access_token":"1234"}'));
    let exercise: Exercise = new Exercise("Leg Killer", "A hard day for your legs", "6-8", 3, "None", 60, [], 8);
    let respStatus = service.attemptSubmitExercise(exercise);
    const req = httpMock.expectOne("http://localhost:3000/workout/createExercise");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      "title": exercise.title,
      "description": exercise.description,
      "repRange": exercise.repRange,
      "sets": exercise.sets,
      "Posedescription": exercise.Posedescription,
      "restPeriod": exercise.restPeriod,
      "tags": exercise.tags,
      "duratime": exercise.duratime
    });

    let resp = new HttpResponse({
      status: 200
    });

    req.flush(resp);
    let status = await respStatus;
    expect(status).toEqual(200);
  });
  it("should fail to create an exercise because server responds with status code 400 (i.e. data is missing or invalid)", async () => {
    let exercise: Exercise = new Exercise("Leg Killer", "A hard day for your legs", null, 3, "None", 60, [], 8);
    let respStatus = service.attemptSubmitExercise(exercise);

    const req = httpMock.expectOne("http://localhost:3000/workout/createExercise");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      "title": exercise.title,
      "description": exercise.description,
      "repRange": exercise.repRange,
      "sets": exercise.sets,
      "Posedescription": exercise.Posedescription,
      "restPeriod": exercise.restPeriod,
      "tags": exercise.tags,
      "duratime": exercise.duratime
    });

    let resp = new HttpErrorResponse({
      status: 400
    });
    req.flush(null,resp);

    let status = await respStatus;
    expect(status).toEqual(400);
  });
  it("should fail to create an exercise because server does not respond and returns status 0 which should be translated to 500", async () => {
    let exercise: Exercise = new Exercise("Leg Killer", "A hard day for your legs", null, 3, "None", 60, [], 8);
    let respStatus = service.attemptSubmitExercise(exercise);

    const req = httpMock.expectOne("http://localhost:3000/workout/createExercise");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      "title": exercise.title,
      "description": exercise.description,
      "repRange": exercise.repRange,
      "sets": exercise.sets,
      "Posedescription": exercise.Posedescription,
      "restPeriod": exercise.restPeriod,
      "tags": exercise.tags,
      "duratime": exercise.duratime
    });

    let resp = new HttpErrorResponse({
      status: 0
    });
    req.flush(null,resp);

    let status = await respStatus;
    expect(status).toEqual(500);
  });
  it("should fail to create an exercise because server responds with unknown status which should be translated to 500", async () => {
    let exercise: Exercise = new Exercise("Leg Killer", "A hard day for your legs", null, 3, "None", 60, [], 8);
    let respStatus = service.attemptSubmitExercise(exercise);

    const req = httpMock.expectOne("http://localhost:3000/workout/createExercise");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      "title": exercise.title,
      "description": exercise.description,
      "repRange": exercise.repRange,
      "sets": exercise.sets,
      "Posedescription": exercise.Posedescription,
      "restPeriod": exercise.restPeriod,
      "tags": exercise.tags,
      "duratime": exercise.duratime
    });

    let resp = new HttpErrorResponse({
      status: 493
    });
    req.flush(null,resp);

    let status = await respStatus;
    expect(status).toEqual(493);
  });

  // Create Workout Unit Tests
  it("should create a workout successfully because server responds with status code 200", async () => {
    let workout: Workout = new Workout("Leg Killer", "A hard day for your legs", []);
    let respStatus = service.attemptSubmitWorkout(workout);

    const req = httpMock.expectOne("http://localhost:3000/workout/createWorkout");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      "workoutTitle": workout.title,
      "workoutDescription": workout.description,
      "tags": workout.tags
    });

    let resp = new HttpResponse({
      status: 200
    });
    req.flush(resp);

    let status = await respStatus;
    expect(status).toEqual(200);
  });
  it("should fail to create a workout because server responds with status code 400 (i.e. data is missing or invalid)", async () => {
    let workout: Workout = new Workout("Leg Killer", null, []);
    let respStatus = service.attemptSubmitWorkout(workout);

    const req = httpMock.expectOne("http://localhost:3000/workout/createWorkout");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      "workoutTitle": workout.title,
      "workoutDescription": workout.description,
      "tags": workout.tags
    });

    let resp = new HttpErrorResponse({
      status: 400
    });
    req.flush(null,resp);

    let status = await respStatus;
    expect(status).toEqual(400);
  });
  it("should fail to create a workout because server does not respond and returns status 0 which should be translated to 500", async () => {
    let workout: Workout = new Workout("Leg Killer", null, []);
    let respStatus = service.attemptSubmitWorkout(workout);

    const req = httpMock.expectOne("http://localhost:3000/workout/createWorkout");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      "workoutTitle": workout.title,
      "workoutDescription": workout.description,
      "tags": workout.tags
    });

    let resp = new HttpErrorResponse({
      status: 0
    });
    req.flush(null,resp);

    let status = await respStatus;
    expect(status).toEqual(500);
  });
  it("should fail to create a workout because server responds with unknown status which should be translated to 500", async () => {
    let workout: Workout = new Workout("Leg Killer", "A test for the legs", []);
    let respStatus = service.attemptSubmitWorkout(workout);

    const req = httpMock.expectOne("http://localhost:3000/workout/createWorkout");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      "workoutTitle": workout.title,
      "workoutDescription": workout.description,
      "tags": workout.tags
    });

    let resp = new HttpErrorResponse({
      status: 493
    });
    req.flush(null,resp);

    let status = await respStatus;
    expect(status).toEqual(493);
  });

  /**
   * Getting the workouts
   */
  it('should obtain all the workouts and return a 200 status',async () => {

    let respStatus = service.attemptGetWorkouts();

    const req = httpMock.expectOne("http://localhost:3000/workout/getworkout");
    expect(req.request.method).toEqual('GET');

    let resp = new HttpResponse({
      status: 200,
      statusText: "Workouts obtained",
      body : {"message": "Successfully retrieved workouts",
        "data": [
          {
            "workoutTitle": "Potato Salad",
            "workoutDescription": "1 minute instant shred",
            "exercises": [],
            "difficulty": "EXTREME",
            "planner_Email": null
          },
          {
            "workoutTitle": "Luca's Shred",
            "workoutDescription": "3 day program to lose 20kg",
            "exercises": [],
            "difficulty": "MEDIUM",
            "planner_Email": null
          },
          {
            "workoutTitle": "Msi's bicep wrecker",
            "workoutDescription": "20 bicep curls with 60kgs 10 sets",
            "exercises": [],
            "difficulty": "MEDIUM",
            "planner_Email": null
          },
          {
            "workoutTitle": "Jenny's shred programme",
            "workoutDescription": "1 day to lose 50kg",
            "exercises": [],
            "difficulty": "EASY",
            "planner_Email": null
          },
          {
            "workoutTitle": "Zelu's chest pump",
            "workoutDescription": "3 pumps a day",
            "exercises": [],
            "difficulty": "EASY",
            "planner_Email": null
          }
        ]}
    });
    req.flush(resp);
    let status = await respStatus;
    let StatusValue = <number>status['status'];
    expect(StatusValue).toEqual(200);
  });

  /**
   * Getting the workouts with no workouts in the database
   */
  it('should fail to get all workouts because none exist in the database', async ()=>{
    let respStatus = service.attemptGetWorkouts();

    const req = httpMock.expectOne("http://localhost:3000/workout/getworkout");
    expect(req.request.method).toEqual('GET');

    let resp = new HttpResponse({
      status: 404,
      statusText: "No workouts were found in the database",
      body : {"message": "Failed to retrieve workouts"}
    });
    req.flush(resp);
    let status = await respStatus;
    let StatusValue = <number>status['status'];
    expect(StatusValue).toEqual(404);
  });

  it("should fail to obtain the workouts because server does not respond and returns status 500", async () => {
    let respStatus = service.attemptGetWorkouts();
    const req = httpMock.expectOne("http://localhost:3000/workout/getworkout");
    expect(req.request.method).toEqual('GET');

    let resp = new HttpErrorResponse({
      status: 500,
      statusText: "Server not responding."
    });
    req.flush(null,resp);
    let status = await respStatus;
    let StatusValue = <number>status['status'];
    expect(StatusValue).toEqual(500);
  });
});
