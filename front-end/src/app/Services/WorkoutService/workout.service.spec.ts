import { TestBed } from '@angular/core/testing';

import { WorkoutService } from './workout.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Exercise} from "../../Models/exercise";
import {Workout} from "../../Models/workout";

describe('WorkoutService', () => {
  let service: WorkoutService;
  let httpMock:HttpTestingController;
  let httpClient:HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(WorkoutService);
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
    let exercise: Exercise = new Exercise("Leg Killer", "A hard day for your legs", "6-8", 3, "None", 60, "HARD", 8);
    let respStatus = service.attemptSubmitExercise(exercise);

    const req = httpMock.expectOne("http://localhost:5500/workout/createExercise");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      "title": exercise.title,
      "description": exercise.description,
      "repRange": exercise.repRange,
      "sets": exercise.sets,
      "Posedescription": exercise.Posedescription,
      "restPeriod": exercise.restPeriod,
      "difficulty": exercise.difficulty.toUpperCase(),
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
    let exercise: Exercise = new Exercise("Leg Killer", "A hard day for your legs", null, 3, "None", 60, "HARD", 8);
    let respStatus = service.attemptSubmitExercise(exercise);

    const req = httpMock.expectOne("http://localhost:5500/workout/createExercise");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      "title": exercise.title,
      "description": exercise.description,
      "repRange": exercise.repRange,
      "sets": exercise.sets,
      "Posedescription": exercise.Posedescription,
      "restPeriod": exercise.restPeriod,
      "difficulty": exercise.difficulty.toUpperCase(),
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
    let exercise: Exercise = new Exercise("Leg Killer", "A hard day for your legs", null, 3, "None", 60, "HARD", 8);
    let respStatus = service.attemptSubmitExercise(exercise);

    const req = httpMock.expectOne("http://localhost:5500/workout/createExercise");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      "title": exercise.title,
      "description": exercise.description,
      "repRange": exercise.repRange,
      "sets": exercise.sets,
      "Posedescription": exercise.Posedescription,
      "restPeriod": exercise.restPeriod,
      "difficulty": exercise.difficulty.toUpperCase(),
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
    let exercise: Exercise = new Exercise("Leg Killer", "A hard day for your legs", null, 3, "None", 60, "HARD", 8);
    let respStatus = service.attemptSubmitExercise(exercise);

    const req = httpMock.expectOne("http://localhost:5500/workout/createExercise");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      "title": exercise.title,
      "description": exercise.description,
      "repRange": exercise.repRange,
      "sets": exercise.sets,
      "Posedescription": exercise.Posedescription,
      "restPeriod": exercise.restPeriod,
      "difficulty": exercise.difficulty.toUpperCase(),
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
    let workout: Workout = new Workout("Leg Killer", "A hard day for your legs", "HARD");
    let respStatus = service.attemptSubmitWorkout(workout);

    const req = httpMock.expectOne("http://localhost:5500/workout/createWorkout");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      "workoutTitle": workout.title,
      "workoutDescription": workout.description,
      "difficulty": workout.difficulty
    });

    let resp = new HttpResponse({
      status: 200
    });
    req.flush(resp);

    let status = await respStatus;
    expect(status).toEqual(200);
  });
  it("should fail to create a workout because server responds with status code 400 (i.e. data is missing or invalid)", async () => {
    let workout: Workout = new Workout("Leg Killer", null, "HARD");
    let respStatus = service.attemptSubmitWorkout(workout);

    const req = httpMock.expectOne("http://localhost:5500/workout/createWorkout");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      "workoutTitle": workout.title,
      "workoutDescription": workout.description,
      "difficulty": workout.difficulty
    });

    let resp = new HttpErrorResponse({
      status: 400
    });
    req.flush(null,resp);

    let status = await respStatus;
    expect(status).toEqual(400);
  });
  it("should fail to create a workout because server does not respond and returns status 0 which should be translated to 500", async () => {
    let workout: Workout = new Workout("Leg Killer", null, "HARD");
    let respStatus = service.attemptSubmitWorkout(workout);

    const req = httpMock.expectOne("http://localhost:5500/workout/createWorkout");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      "workoutTitle": workout.title,
      "workoutDescription": workout.description,
      "difficulty": workout.difficulty
    });

    let resp = new HttpErrorResponse({
      status: 0
    });
    req.flush(null,resp);

    let status = await respStatus;
    expect(status).toEqual(500);
  });
  it("should fail to create a workout because server responds with unknown status which should be translated to 500", async () => {
    let workout: Workout = new Workout("Leg Killer", "A test for the legs", "HARD");
    let respStatus = service.attemptSubmitWorkout(workout);

    const req = httpMock.expectOne("http://localhost:5500/workout/createWorkout");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      "workoutTitle": workout.title,
      "workoutDescription": workout.description,
      "difficulty": workout.difficulty
    });

    let resp = new HttpErrorResponse({
      status: 493
    });
    req.flush(null,resp);

    let status = await respStatus;
    expect(status).toEqual(493);
  });
});
