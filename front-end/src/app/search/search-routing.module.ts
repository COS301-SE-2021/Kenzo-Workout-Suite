import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SearchPage } from "./search.page";
import { YourWorkoutsPage } from "../your-workouts/your-workouts.page";
import {ProfilePage} from "../profile/profile.page";
import {ClientListPage} from "../client-list/client-list.page";
import {CreateExercisePage} from "../create-exercise/create-exercise.page";
import {UpdateExercisePage} from "../update-exercise/update-exercise.page";

const routes: Routes = [
    {
        path: "",
        component: SearchPage
    },
    {
        path: "your-workouts",
        component: YourWorkoutsPage
    },
    {
        path: "profile",
        component: ProfilePage
    },
    {
        path: "client-list",
        component: ClientListPage
    },
    {
        path: "update-exercise",
        component: UpdateExercisePage
    },
    {
        path: "create-exercise",
        component: CreateExercisePage
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SearchPageRoutingModule {}
