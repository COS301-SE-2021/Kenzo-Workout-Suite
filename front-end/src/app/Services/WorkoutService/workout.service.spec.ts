import { TestBed } from '@angular/core/testing';

import { WorkoutService } from './workout.service';
import {HttpTestingController, HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClient, HttpErrorResponse, HttpResponse, HttpClientModule } from "@angular/common/http";

describe('WorkoutService', () => {
  let service: WorkoutService;
  let httpMock:HttpTestingController;
  let httpClient:HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule]
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

  it("should create an exercise ", ()=>{

  });

  /**
   * Getting the workouts
   */
  it('should obtain all the workouts and return a 200 status',async () => {

    let respStatus = service.attemptGetWorkouts();

    const req = httpMock.expectOne("http://localhost:5500/workout/getworkout");
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
  it('it should fail to get all workouts because non exist in the database', async ()=>{
    let respStatus = service.attemptGetWorkouts();

    const req = httpMock.expectOne("http://localhost:5500/workout/getworkout");
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


});
