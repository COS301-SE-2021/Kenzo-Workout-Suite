import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { YourWorkoutsPage } from "./your-workouts.page";
import { CreateWorkoutPage} from "../create-workout/create-workout.page";
import { SearchPage } from "../search/search.page";
import {ProfilePage} from "../profile/profile.page";
import {UpdateWorkoutPage} from "../update-workout/update-workout.page";
import {UpdateExercisePage} from "../update-exercise/update-exercise.page";

const routes: Routes = [
    {
        path: "",
        component: YourWorkoutsPage
    },
    {
        path: "create-workout",
        component: CreateWorkoutPage
    },
    {
        path: "search",
        component: SearchPage
    },
    {
        path: "profile",
        component: ProfilePage
    },
    {
        path: "update-workout",
        component: UpdateWorkoutPage
    },
    {
        path: "update-exercise",
        component: UpdateExercisePage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class YourWorkoutsPageRoutingModule {}
