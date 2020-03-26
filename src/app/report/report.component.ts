import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { TestService } from '../services/Test.service';
import { Candidate } from '../candidate';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  nrSelect: string = "All"
  submitted = false;
  dtOptions: DataTables.Settings = {};
  ItemsArray = [];
  p: number;
  UserForm: any;
  today: string;
  PageTitle: string;
  errorMessage: string;
  SuccessMassage: string;
  UserSectionArray = [];
  ItemsArrayExcel = [];
  public TestResultList = [{ name: 'All', value: 'A' }, { name: 'Pass', value: 'P' }, { name: 'Fail', value: 'F' }];
  constructor(private datePipe: DatePipe, private testService: TestService, private loginService: LoginService, private datepie: DatePipe, private router: Router) {
    this.PageTitle = "Test Report Search Criteria";
  }

  get f() { return this.UserForm.controls; }
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Test Summary Report :',
    useBom: true,
    noDownload: false,
    headers: ["Employee ID", "Employee Name", "Email", "Contact No", "Department", "Test Date", "Test Result", "Retest Date"]
  };

  ngOnInit() {

    this.today = new Date().toISOString().split('T')[0];

    this.ItemsArray = [];
    this.ItemsArrayExcel = [];

    this.UserForm = new FormGroup({
      TestDateFrom: new FormControl('', Validators.required),
      TestDateTo: new FormControl('', Validators.required),
      Department: new FormControl(),
      TestResult: new FormControl('A', Validators.required),
      EmployeeId: new FormControl(''),
      EmployeeName: new FormControl(''),
      RetestDateFrom: new FormControl(''),
      RetestDateTo: new FormControl(''),

    });

    this.UserForm.patchValue({
      TestDateFrom: this.today,
      TestDateTo: this.today
    });

    this.getUserSetion();
    this.getUser();
  }

  onBack() {
    this.router.navigate(['/AdminDashboard']);
  }

  getUserSetion() {
    this.loginService.GetQuickCode("DEPARTMENT").subscribe((result: any) => {
      if (result.status == "success")
        this.UserSectionArray = result.data;
      else
        this.errorMessage = result.message;
    })
  }

  onFormSubmit() {
    this.submitted = true;
    this.getUser();
  }

  downloadCSV() {
    this.ItemsArrayExcel = this.ItemsArray;
    this.ItemsArrayExcel.forEach(item => delete item.TestID);
    this.ItemsArrayExcel.forEach(item => delete item.RetestReq);

    this.ItemsArrayExcel.forEach(element => {
      if (element.TestDate != null)
        element.TestDate = this.datePipe.transform(element.TestDate, 'dd-MMM-yyyy');

      if (element.RetestDate != null)
        element.RetestDate = this.datePipe.transform(element.RetestDate, 'dd-MMM-yyyy');
    });

    const newData = JSON.parse(JSON.stringify(this.ItemsArrayExcel, (key, value) =>
      value === null || value === undefined
        ? ''    // return empty string for null or undefined
        : value // return everything else unchanged
    ));

    new AngularCsv(newData, "Test Summary Report", this.csvOptions);
  }

  getUser() {
    this.testService.GetTestReport(this.UserForm.value).subscribe((result: any) => {

      if (result.status == "success") {
        this.ItemsArray = result.data;

        this.ItemsArray.forEach(element => {

          if (element.TestResult != null && element.TestResult == "F")
            element.TestResult = "Fail"
          else if (element.TestResult != null && element.TestResult == "P")
            element.TestResult = "Pass"

          if (element.TestDate != null)
            element.TestDate = this.datePipe.transform(element.TestDate, 'dd-MMM-yyyy');


        });
      }
      this.errorMessage = result.message;

    })
    this.p = 1;
  }

}
