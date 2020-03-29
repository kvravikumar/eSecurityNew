import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Candidate } from '../candidate';
import { Observable } from 'rxjs';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { error } from 'util';
import { Router } from '@angular/router';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { DatePipe } from '@angular/common';



@Component({
    selector: 'app-candidate',
    templateUrl: './candidate.component.html'
})


export class CandidateComponent {

    dtOptions: DataTables.Settings = {};

    submitted = false;
    PageTitle: string;
    data = false;
    UserForm: FormGroup;
    UserSearchForm: FormGroup;
    SuccessMassage: string;
    errorMessage: string;
    User_ID: string;
    User_Group: string;
    enableEdit = false;
    enableEditIndex = null;
    ItemsArray = [];
    ItemsArrayExcel = [];
    UserSectionArray = [];
    AdminContact: string;
    mode: string;
    p: number = 1;
    pagecount: number = 5;

    Candidates: Candidate[] = [];
    editIndex: number = null;
    bNominate: boolean = false;

    public CandidateStatus = [{ name: 'Active', value: 'A' }, { name: 'In-Active', value: 'I' }];
    public CandidateUserGroup = [{ name: 'SuperAdmin' }, { name: 'Admin' }, { name: 'Client' }];

    constructor(private datePipe: DatePipe, private router: Router, private loginService: LoginService, private fb: FormBuilder) {
        this.getCandidateStatus();
        this.PageTitle = "New Employee";
    }

    csvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        title: 'Employee Report :',
        useBom: true,
        noDownload: false,
        headers: ["Employee ID", "First Name", "Last Name", "Password", "User Group", "Email", "Contact No", "Department", "Status", "Test Attend Ind","Test Status","Created By", "Created Date", "Modify By", "Modifiy Date"]
    };
    get f() { return this.UserForm.controls; }
    ngOnInit() {

        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true
        };

        this.mode = "New";
        this.ItemsArray = [];
        this.ItemsArrayExcel = [];
        this.User_ID = sessionStorage.getItem("User_ID");
        this.User_Group = sessionStorage.getItem("UserGroup");

        this.UserForm = new FormGroup({
            Id: new FormControl('', Validators.required),
            Password: new FormControl('', Validators.required),
            FirstName: new FormControl('', Validators.required),
            LastName: new FormControl(''),
            UserEmail: new FormControl('', [Validators.required, Validators.email]),
            UserGroup: new FormControl('', Validators.required),
            UserSection: new FormControl('', Validators.required),
            ContactNo: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(75)]),
            Status: new FormControl('A', Validators.required),
            SearchValue: new FormControl(''),
            CreatedBy: new FormControl(this.User_ID),
            CreatedDate: new FormControl(Date.now().toString()),
            ModifiedBy: new FormControl(this.User_ID),
            ModifiedDate: new FormControl(Date.now().toString())
        });

        this.UserSearchForm = new FormGroup({

            SearchValue: new FormControl(''),

        });

        this.getUser();
        this.getUserSetion();
        this.getAdminContact();


    }



    onFormSubmit() {
        this.submitted = true;
        this.SuccessMassage = "";
        this.errorMessage = "";

        // stop here if form is invalid
        if (this.UserForm.invalid) {
            return;
        }

        const user = this.UserForm.value;
        this.Createemployee(user);
        this.submitted = false;
    }


    onUserSearch() {

        this.UserSearchForm.get("SearchValue").valueChanges.subscribe(selectedValue => {
            selectedValue = selectedValue == "" ? null : selectedValue;
            this.getUserData(selectedValue)                           //latest value of firstname
        })

    }

    onDelete() {

        this.SuccessMassage = "";
        this.errorMessage = "";

        var r = confirm("Please confirm the user to delete?");
        if (r == true) {
            this.UserForm.controls['Id'].enable();
            const user = this.UserForm.value;
            this.loginService.DeleteUser(user).subscribe((result) => {
                if (result.status == "success") {
                    this.data = true;
                    this.SuccessMassage = result.message;
                    this.errorMessage = "";
                    this.UserForm.reset();
                    this.UserSearchForm.reset();
                    this.getUser();
                    this.submitted = false;
                } else {
                    this.SuccessMassage = '';
                    this.errorMessage = result.message;
                }
            }, error => {
                this.data = true;
                this.errorMessage = error.message;
            });

        }

        return false;
    }

    downloadCSV($e) {
        $e.preventDefault();
        this.ItemsArrayExcel = this.ItemsArray;
        this.ItemsArrayExcel.forEach(item => delete item.NominateInd);
        this.ItemsArrayExcel.forEach(function (obj) {
            obj.Password = "***";
        });

        const newData = JSON.parse(JSON.stringify(this.ItemsArrayExcel, (key, value) =>
            value === null || value === undefined
                ? ''    // return empty string for null or undefined
                : value // return everything else unchanged
        ));

        new AngularCsv(newData, "Employee Report", this.csvOptions);
    }



    Createemployee(candidate: Candidate) {

        this.UserForm.patchValue({
            CreatedBy: this.User_ID,
            CreatedDate: Date.now().toString(),
            ModifiedBy: this.User_ID,
            ModifiedDate: Date.now().toString()
        });
        this.UserForm.controls['Id'].enable();
        const user = this.UserForm.value;
        if (this.PageTitle == "New Employee") {
            this.loginService.CreateUser(user).subscribe((response) => {
                if (response.status == "success") {
                    this.data = true;
                    this.SuccessMassage = response.message;
                    this.errorMessage = "";
                    this.UserForm.reset();
                    this.UserForm.patchValue({ Status: "A" });
                    this.UserSearchForm.reset();
                    this.getUser();
                    this.mode = "New";
                    // this.SuccessMassage = '';
                }
                else {
                    this.SuccessMassage = '';
                    this.errorMessage = response.message;
                }
            }, error => {
                this.data = true;
                this.errorMessage = error.message;
            });
        }
        else {
            this.loginService.UpdateUser(user).subscribe((response) => {
                if (response.status == "success") {
                    this.data = true;
                    this.SuccessMassage = response.message;
                    this.errorMessage = "";
                    this.UserForm.reset();
                    this.UserSearchForm.reset();
                    this.UserForm.patchValue({ Status: "A" });
                    this.PageTitle = "New Employee";
                    this.errorMessage = "";
                    this.getUser();
                    this.mode = "New";
                    // this.SuccessMassage = '';
                    //this.onUserSearch();
                }
                else {
                    this.SuccessMassage = '';
                    this.errorMessage = response.message;
                }

            }, error => {
                this.data = true;
                // this.SuccessMassage = "";
                this.errorMessage = error.message;
            });
        }

    }

    getCandidateStatus() {

        return this.CandidateStatus;
    }
    getUser() {
        // const user = this.UserForm.value;
        this.loginService.GetUsers(null).subscribe((result: any) => {

            if (result.status == "success") {
                result.data.forEach(element => {

                    if (element.Status != null && element.Status == "A")
                        element.Status = "Active"
                    else if (element.Status != null && element.Status == "I")
                        element.Status = "In-Active"

                    if (element.CreatedDate != null)
                        element.CreatedDate = this.datePipe.transform(element.CreatedDate, 'dd-MMM-yyyy');

                    if (element.ModifyDate != null)
                        element.ModifyDate = this.datePipe.transform(element.ModifyDate, 'dd-MMM-yyyy');


                });
            }


            this.ItemsArray = result.data;

        })
    }

    getUserData(user) {

        this.loginService.GetUsers(user).subscribe((res: any) => {

            if (res.status == "success") {
                res.data.forEach(element => {

                    if (element.Status != null && element.Status == "A")
                        element.Status = "Active"
                    else if (element.Status != null && element.Status == "I")
                        element.Status = "In-Active"

                    if (element.CreatedDate != null)
                        element.CreatedDate = this.datePipe.transform(element.CreatedDate, 'dd-MMM-yyyy');

                    if (element.ModifyDate != null)
                        element.ModifyDate = this.datePipe.transform(element.ModifyDate, 'dd-MMM-yyyy');

                });
                this.ItemsArray = res.data;
                this.p = 1;
            }


        })
    }

    getUserSetion() {
        this.loginService.GetQuickCode("DEPARTMENT").subscribe((res: any) => {

            if (res.status == "success") {
                this.UserSectionArray = res.data;
            }
            else
                this.errorMessage = res.message;


        })
    }

    getAdminContact() {
        this.loginService.GetQuickCode("WEBPAGE_CONTACT").subscribe((res: any) => {

            if (res.status == "success") {
                this.AdminContact = res.data[0].CodeName;
            }
            else
                this.errorMessage = res.message;

        })
    }

    onBack() {
        if (this.User_Group.toUpperCase() == "ADMIN" || this.User_Group.toUpperCase() == "SUPERADMIN")
            this.router.navigate(['/AdminDashboard']);
        else
            this.router.navigate(['/ClientDashboard']);
    }

    onNominate() {
        this.UserForm.controls['Id'].enable();
        this.loginService.LogNominate(this.UserForm.value.Id, this.User_ID).subscribe((res: any) => {
            //this.ItemsArray = res;
            if (res.status == "success") {
                this.SuccessMassage = res.message;
                this.UserForm.controls['Id'].disable();
            }
            else
                this.errorMessage = res.message;

        })

    }

    onEditClick(event, index: number) {
        this.errorMessage = "";
        this.SuccessMassage = "";

        if (this.PageTitle == "Update Employee")
            this.errorMessage = "Page already in edit mode.";
        else {
            this.mode = "edit";
            this.ItemsArray[index].inedit = true;
            this.UserForm.patchValue({
                Id: this.ItemsArray[index].Id,
                Password: this.ItemsArray[index].Password,
                FirstName: this.ItemsArray[index].FirstName,
                LastName: this.ItemsArray[index].LastName,
                UserEmail: this.ItemsArray[index].UserEmail,
                UserGroup: this.ItemsArray[index].UserGroup,
                UserSection: this.ItemsArray[index].UserSection,
                ContactNo: this.ItemsArray[index].ContactNo,
                Status: this.ItemsArray[index].Status == "Active" ? "A" : "I",
                UserType: this.ItemsArray[index].UserType,
                NominateInd: this.ItemsArray[index].NominateInd
            });

            this.UserForm.controls['Id'].disable();
            if (this.ItemsArray[index].NominateInd == "Y") {
                this.bNominate = this.ItemsArray[index].Status == "Active" ? false : true;
            }
            else {
                this.bNominate = true;
            }

            this.PageTitle = "Update Employee";
        }
    }


    onCancelClick(index: number) {

        this.UserForm.reset();
        this.PageTitle = "New Employee";
        this.SuccessMassage = ""
        this.errorMessage = ""
        this.mode = "New";
        this.submitted = false;
        this.ItemsArray[index].inedit = false;
        this.UserForm.patchValue({
            Status: "A",
        });
        this.UserForm.controls['Id'].enable();
    }


}
