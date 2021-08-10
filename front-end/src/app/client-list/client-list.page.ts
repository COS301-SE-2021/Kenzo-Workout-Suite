import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "app-client-list",
    templateUrl: "./client-list.page.html",
    styleUrls: ["./client-list.page.scss"],
})
export class ClientListPage implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() {
    }

    async goToFYP(){
        await this.router.navigate(["/your-workouts"])
            .then(() => {
                window.location.reload();
            });
    }

    async goToProfile(){
        await this.router.navigate(["/profile"])
            .then(() => {
                window.location.reload();
            });
    }

    async goToSearch(){
        await this.router.navigate(["/search"])
            .then(() => {
                window.location.reload();
            });
    }

}
