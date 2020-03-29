
import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { RouterModule, Router } from '@angular/router';
import { Candidate } from "src/app/candidate";


@Component({
    selector: 'app-nav-Adminmenu',
    templateUrl: './nav-Adminmenu.component.html',
    styleUrls: ['./nav-Adminmenu.component.css']
})
export class NavAdminMenuComponent {

    currentUser: Candidate;
    CandidateArray = [];

    constructor(
        private router: Router,
        private LoginService: LoginService
    ) {


        this.LoginService.currentUser.subscribe(x => this.currentUser = x);

    }

    isExpanded = false;

    collapse() {
        this.isExpanded = false;
    }

    toggle() {
        this.isExpanded = !this.isExpanded;
    }


    userTypeAdmin: boolean;
    userTypeClient: boolean;

    User_ID: string = sessionStorage.getItem("User_ID");
    User_Name: string = sessionStorage.getItem("User_Name");
    UserGroup: string = sessionStorage.getItem("UserGroup");

    ngOnInit() {


        if (this.LoginService.currentUserValue == null)
            this.logout();
        else {
            // this.getUser();
            if (this.LoginService.currentUserValue.UserGroup.toUpperCase() == "ADMIN" || this.LoginService.currentUserValue.UserGroup.toUpperCase() == "SUPERADMIN")
                this.userTypeAdmin = true;
            else if (this.LoginService.currentUserValue.UserGroup.toUpperCase() == "CLIENT")
                this.userTypeClient = true
        }

    }

    OnHome() {

        if (this.UserGroup.toUpperCase() == "ADMIN" || this.UserGroup.toUpperCase() == "SUPERADMIN")
            this.router.navigate(['/AdminDashboard']);
        else
            this.router.navigate(['/ClientDashboard']);

    }
    logout() {
        this.LoginService.logout();
        this.router.navigate(['/login']);
    }

}
