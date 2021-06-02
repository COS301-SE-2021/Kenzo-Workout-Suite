import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Component({
  selector: 'app-your-workouts',
  templateUrl: './your-workouts.page.html',
  styleUrls: ['./your-workouts.page.scss'],
})
export class YourWorkoutsPage implements OnInit {
  workouts: Observable<any>;
  constructor(private http:HttpClient) { }

  ngOnInit() {
    this.LoadWorkouts();
  }

  LoadWorkouts(){
    const url: string = "http://localhost:5500/workout/getworkout"
    this.workouts = this.http.get(url, {responseType: 'json'});
    this.workouts.subscribe(x=>{
      this.workouts = x["data"];
    })
  }

}
