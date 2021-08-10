import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ProfilePage } from "./profile.page";
import {YourWorkoutsPage} from "../your-workouts/your-workouts.page";
import {SearchPage} from "../search/search.page";
import {ClientListPage} from "../client-list/client-list.page";

const routes: Routes = [
    {
        path: "",
        component: ProfilePage
    },
    {
        path: "your-workouts",
        component: YourWorkoutsPage
    },
    {
        path: "search",
        component: SearchPage
    },
    {
        path: "client-list",
        component: ClientListPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
