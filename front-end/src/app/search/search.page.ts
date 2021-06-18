import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  workouts: Observable<any>;
  constructor(private http:HttpClient) { }

  ngOnInit() {
    this.loadWorkouts();
  }


  /**
   * Load all the workouts
   *
   */
  loadWorkouts(){
    const url: string = "http://localhost:5500/workout/getworkout"
    this.workouts = this.http.get(url, {responseType: 'json'});
    this.workouts.subscribe(x=>{
      this.workouts = x["data"];
    })
  }

}
