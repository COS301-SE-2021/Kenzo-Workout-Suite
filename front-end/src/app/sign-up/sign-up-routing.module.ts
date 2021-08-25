import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SignUpPage } from "./sign-up.page";
import { SignInPage } from "../sign-in/sign-in.page";


const routes: Routes = [
    {
        path: "",
        component: SignUpPage
    },
    {
        path: "sign-in",
        component: SignInPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SignUpPageRoutingModule {}
