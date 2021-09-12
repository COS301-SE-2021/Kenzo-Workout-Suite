import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { YourWorkoutsPage } from "./your-workouts.page";

const routes: Routes = [
    {
        path: "",
        component: YourWorkoutsPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class YourWorkoutsPageRoutingModule {}
