import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { YourWorkoutsPage } from "../your-workouts/your-workouts.page";
import { SearchPage } from "../search/search.page";
import { ProfilePage } from "../profile/profile.page";
import { ClientListPage } from "./client-list.page";

const routes: Routes = [
    {
        path: "",
        component: ClientListPage
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
        path: "your-workouts",
        component: YourWorkoutsPage
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClientListPageRoutingModule {}
