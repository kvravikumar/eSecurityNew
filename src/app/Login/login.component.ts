import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {

    model: any = {};
    errorMessage: string;
    angForm: FormGroup;
    constructor(private router: Router, private LoginService: LoginService, private fb: FormBuilder) {
        this.createForm();

        if (this.LoginService.currentUserValue) {
            this.redirectUrl(this.LoginService.currentUserValue.UserType);
        }
    }

    get f() {
        return this.angForm.controls;
    }
    createForm() {
        this.angForm = this.fb.group({
            Id: ['', [Validators.required, Validators.minLength(3)]],
            Passward: ['', [Validators.required, Validators.minLength(3)]]
        });
    }

    ngOnInit() {
        // sessionStorage.removeItem('UserName');
        sessionStorage.clear();
    }
    login() {
        //  debugger;
        this.LoginService.Login(this.model).subscribe(
            result => {

                if (result.status == "success") {
                   

                        sessionStorage.setItem("User_ID", result.data[0].Id);
                        sessionStorage.setItem("User_Name", result.data[0].FirstName.concat(result.data[0].LastName == null ? "" : " ".concat(result.data[0].LastName)));
                        sessionStorage.setItem("UserGroup", result.data[0].UserGroup);
                        this.redirectUrl(result.data[0].UserGroup)
                    

                }
                else {
                    //  this.errorMessage = "Login Failed: invalid user id or password";
                    this.errorMessage = result.message;
                }

            },
            error => {
                this.errorMessage = error.message;
            });
    };

    redirectUrl(UserGroup: string) {

        if (UserGroup == "Admin")
            this.router.navigate(['/AdminDashboard']);
        if (UserGroup == "Client")
            this.router.navigate(['/ClientDashboard']);
    }
}
