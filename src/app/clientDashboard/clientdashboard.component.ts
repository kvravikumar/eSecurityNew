import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { TestService } from '../services/Test.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ClientTest } from '../models/ClientTest';
import { DatePipe } from '@angular/common';



declare var require: any
const FileSaver = require('file-saver');

@Component({
  selector: 'app-clientdashboard',
  templateUrl: './clientdashboard.component.html',
})
export class ClientDashboardComponent implements OnInit {
  TrainingMaterial: string;
  p: number;
  datatable: any;
  dtOptions: DataTables.Settings = {};
  clientTest: ClientTest[] = [];
  // dtTrigger: Subject<any> = new Subject<any>();
  TotalTests: number = 0;
  errorMessage: string;
  testStatus: boolean = false;
  ItemsArray = [];
  AdminContact: string;
  date: Date = new Date();
  ReTestDate: Date;
  constructor(
    private datePipe: DatePipe,
    private router: Router, private LoginService: LoginService, private TestService: TestService) { }
  User_ID: string = sessionStorage.getItem("User_ID");





  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2
    };
    this.getTrainingMaterial();
    this.GetTotalTests();
    this.getTest();
    this.getAdminContact();
  }

  getAdminContact() {
    this.LoginService.GetQuickCode("WEBPAGE_CONTACT").subscribe((res: any) => {
      if (res.status == "success") {
        this.AdminContact = res.data[0].CodeName;
      }
      else
        this.errorMessage = res.message;

    })
  }
  onGenerateReport() {
    this.router.navigate(['/report']);
  }
  onEditClick(index: number) {
    this.router.navigate(['/viewTest'], { queryParams: { TestID: this.ItemsArray[index].TestID } });

  }

  // ngOnDestroy(): void {
  //   // Do not forget to unsubscribe the event
  //   this.dtTrigger.unsubscribe();
  // }
  GetTotalTests() {
    // debugger;
    this.TestService.GetTestByUser(this.User_ID).subscribe(
      result => {
        //              debugger;
        if (result.data.length > 0) {
          this.TotalTests = result.data.length;
        }
        else
          this.errorMessage = result.Message;
      },
      error => {
        this.errorMessage = error.message;
      });
  }

  getTest() {
    this.TestService.GetTestByUser(this.User_ID).subscribe((result: any) => {

      if (result.status == "success") {
        this.clientTest = result.data;
        // const table: any = $('table');
        // this.datatable = table.DataTable();
        // this.dtTrigger.next();
        this.clientTest.forEach(element => {

          if (element.TestResult != null && element.TestResult == "F")
            element.TestResult = "Fail"
          else if (element.TestResult != null && element.TestResult == "P")
            element.TestResult = "Pass"

          if (element.ReTestReq != null && element.ReTestReq == "Y")
            element.ReTestReq = "Yes"
          else if (element.ReTestReq == null || element.ReTestReq == "N" || element.ReTestReq == "")
            element.ReTestReq = "No"

          if (element.TestDate != null)
            element.TestDate = this.datePipe.transform(element.TestDate, 'dd-MMM-yyyy');

          if (element.ReTestDate != null)
            element.ReTestDate = this.datePipe.transform(element.ReTestDate, 'dd-MMM-yyyy');

          this.ReTestDate = new Date(element.ReTestDate);


        });

        this.testStatus = (this.clientTest[this.clientTest.length - 1].TestResult == "Fail") ? false : true;

        if (!this.testStatus && this.ReTestDate >= this.date)
          this.testStatus = true;
        else
          this.testStatus = false;

      }
      else
        this.errorMessage = result.message
    })

  }
  onNewTest() {

    if (this.testStatus)
      this.errorMessage = "There is no test available. Please contact Administrator." + this.AdminContact;
    else
      this.router.navigate(['/Instruction']);
  }
  getTrainingMaterial() {
    this.LoginService.GetQuickCode("TrainingMaterial").subscribe((result: any) => {

      if (result.status == "success") {
        this.TrainingMaterial = result.data[0].CodeName;
      }
      else
        this.errorMessage = result.message;

    })
  }

  onfiledownload() {
    this.downloadPdf(this.TrainingMaterial);
  }


  downloadPdf(filename: string) {
    const pdfUrl = '.\\assets\\documents\\' + filename;
    const pdfName = filename;
    FileSaver.saveAs(pdfUrl, pdfName);
  }
}
