import { TestBed } from '@angular/core/testing';

import { WorkoutService } from './workout.service';
import {HttpTestingController} from "@angular/common/http/testing";
import {HttpClient} from "@angular/common/http";

describe('WorkoutService', () => {
  let service: WorkoutService;
  let httpMock:HttpTestingController;
  let httpClient:HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
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
});
