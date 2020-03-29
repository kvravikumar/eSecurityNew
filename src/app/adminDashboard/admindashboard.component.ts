import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { TestService } from '../services/Test.service';
import { QuickCodeService } from '../services/QuickCode.Services';
import { QuestionSetService } from '../services/questionSet.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';

@Component({
    selector: 'app-admindashboard',
    templateUrl: './admindashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {

    Pagemode = 'ModeCandidates';
   
    p: number;
    model: any = {};
    UserTotalArray = [];
    QuestionSetTotalArray = [];
    QuickCodeTotalArray = [];
    errorMessage: string;
    TotalCandidates: number = 0;
    TotalQuestions: number = 0;
    TotalQucikCode: number = 0;
    User_ID: string = sessionStorage.getItem("User_ID");
    dtOptions: DataTables.Settings = {};
    pagecount: number = 5;

    ItemsArray = [];
    ItemsArrayExcel = [];

    User_Group :string;


    constructor(
        private datePipe: DatePipe ,
        private router: Router, 
        private LoginService: LoginService,
         private TestService: TestService, 
         private QuestionSet: QuestionSetService,
         private quickCodeService:QuickCodeService
         ) { }

    csvUserOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        title: 'Employee Report :',
        useBom: true,
        noDownload: false,
        headers: ["ID", "First Name", "Last Name", "Password", "User Group", "User Email", "Contact No", "Department", "Status", "Created By", "Created Date", "Modify By", "Modify Date"]
    };

    csvQuestionSetOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        title: 'Question Set Report :',
        useBom: true,
        noDownload: false,
        headers: ["Set Category","Seq No","Status","Created By","Created Date","Modify By","Modify Date"]
      };

      csvQuickCodeOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        title: 'QuickCode Report :',
        useBom: true,
        noDownload: false,
        headers: ["Code Type", "Code Name", "Code Desc", "Display Seq", "Status", "Remarks", "Created By", "Created Date", "Modify By", "Modify Date"]
      };

    ngOnInit() {

        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true
        };


        this.ItemsArray = [];
        this.ItemsArrayExcel = [];
        this.User_Group = sessionStorage.getItem("UserGroup").toUpperCase();

        this.GetTotalCandidates();
        this.GetTotalQuestions();
        this.GetTotalQucikCode();
        this.getTest();
    }

    downloadCSV() {
        
        if(this.Pagemode=="ModeCandidates")
        {
            this.ItemsArrayExcel = this.UserTotalArray;
            this.ItemsArrayExcel.forEach(item => delete item.NominateInd);
        }
        else if(this.Pagemode=="ModeQuestionSet")
        {
            this.ItemsArrayExcel = this.QuestionSetTotalArray;
            this.ItemsArrayExcel.forEach( item => delete item.SetID );
        }
        else if(this.Pagemode=="ModeQuickCode")
        {
            this.ItemsArrayExcel = this.QuickCodeTotalArray;
            this.ItemsArrayExcel.forEach( item => delete item.RecID );
        }
            

        //this.dtHolidays : JSONDATA , HolidayList : CSV file Name, this.csvOptions : file options
        if(this.Pagemode=="ModeCandidates")
        new AngularCsv(this.ItemsArrayExcel, "Employee Report", this.csvUserOptions);
        else if(this.Pagemode=="ModeQuestionSet")
        new AngularCsv(this.ItemsArrayExcel, "Question Set Report", this.csvQuestionSetOptions);
        else if(this.Pagemode=="ModeQuickCode")
        new AngularCsv(this.ItemsArrayExcel, "QuickCode Report", this.csvQuickCodeOptions);
        

    }
    GetTotalCandidates() {
        // debugger;
        this.Pagemode = 'ModeCandidates';
        this.LoginService.GetUsers(null).subscribe(
            result => {
                // debugger;
                if (result.status =="success") {

                    result.data.forEach(element => {
                        if (element.Status != null && element.Status == "A")
                          element.Status = "Active"
                        else if (element.Status != null && element.Status == "I")
                          element.Status = "In-Active"
                        
                        element.Password = "***";

                        if (element.CreatedDate != null)
                          element.CreatedDate =  this.datePipe.transform(element.CreatedDate , 'dd-MMM-yyyy');
                      
                        if (element.ModifyDate != null)
                          element.ModifyDate =  this.datePipe.transform(element.ModifyDate , 'dd-MMM-yyyy');
                         
                      });

                    const newData = JSON.parse(JSON.stringify(result.data, (key, value) =>
                      value === null || value === undefined
                          ? ''    // return empty string for null or undefined
                          : value // return everything else unchanged
                     ));



                    this.UserTotalArray = newData;
                    this.TotalCandidates = newData.length;
                }
                else
                    this.errorMessage = result.message;
            },
            error => {
                this.errorMessage = error.message;
            });
    }

    onGenerateReport() {
        this.router.navigate(['/report']);
    }
  
    GetQuestionSetList() {
        this.Pagemode = "ModeQuestionSet"
        this.QuestionSet.GetQuestionSet(null).subscribe(
            result => {
                // debugger;
                if (result.status =="success") {
                    
                    result.data.forEach(element => {
                        if (element.Status != null && element.Status == "A")
                          element.Status = "Active"
                        else if (element.Status != null && element.Status == "I")
                          element.Status = "In-Active"

                        if (element.CreatedDate != null)
                          element.CreatedDate =  this.datePipe.transform(element.CreatedDate , 'dd-MMM-yyyy');
                      
                        if (element.ModifiedDate != null)
                          element.ModifiedDate =  this.datePipe.transform(element.ModifiedDate , 'dd-MMM-yyyy');
                         
                      });

                      const newData = JSON.parse(JSON.stringify(result.data, (key, value) =>
                      value === null || value === undefined
                          ? ''    // return empty string for null or undefined
                          : value // return everything else unchanged
                     ));

                    this.QuestionSetTotalArray = newData;
                }
                else
                    this.errorMessage = result.Message;

            },
            error => {
                this.errorMessage = error.message;
            });
    }

    GetCandidateList() {
        this.Pagemode = "ModeCandidates"
        this.LoginService.GetUsers(null).subscribe(
            result => {
                // debugger;
                if (result.Status =="success") {

                    result.data.forEach(element => {
                        if (element.Status != null && element.Status == "A")
                          element.Status = "Active"
                        else if (element.Status != null && element.Status == "I")
                          element.Status = "In-Active"
                        
                        element.Password = "***";

                        if (element.CreatedDate != null)
                          element.CreatedDate =  this.datePipe.transform(element.CreatedDate , 'dd-MMM-yyyy');
                      
                        if (element.ModifyDate != null)
                          element.ModifyDate =  this.datePipe.transform(element.ModifyDate , 'dd-MMM-yyyy');
                         
                      });

                    const newData = JSON.parse(JSON.stringify(result.data, (key, value) =>
                      value === null || value === undefined
                          ? ''    // return empty string for null or undefined
                          : value // return everything else unchanged
                     ));



                    this.UserTotalArray = newData;
                    this.TotalCandidates = newData.length;
                }
                else
                    this.errorMessage = result.Message;
            },
            error => {
                this.errorMessage = error.message;
            });
    }

    GetQuickCodeList() {
        this.Pagemode = "ModeQuickCode"
        this.quickCodeService.GetQuickCode(null).subscribe(
            result => {
                // debugger;
                if (result.status =="success")
                {
                    result.data.forEach(element => {
                        if (element.Status != null && element.Status == "A")
                          element.Status = "Active"
                        else if (element.Status != null && element.Status == "I")
                          element.Status = "In-Active"

                        if (element.CreatedDate != null)
                          element.CreatedDate =  this.datePipe.transform(element.CreatedDate , 'dd-MMM-yyyy');
                      
                        if (element.ModifiedDate != null)
                          element.ModifiedDate =  this.datePipe.transform(element.ModifiedDate , 'dd-MMM-yyyy');
                         
                      });

                      const newData = JSON.parse(JSON.stringify(result.data, (key, value) =>
                      value === null || value === undefined
                          ? ''    // return empty string for null or undefined
                          : value // return everything else unchanged
                     ));

                      this.QuickCodeTotalArray = newData;
                }
                else
                    this.errorMessage = result.Message;
            },
            error => {
                this.errorMessage = error.message;
            });
    }

    


    GetTotalQuestions() {
        //debugger;
        this.QuestionSet.GetQuestionSet(null).subscribe(
            result => {
                // debugger;
                if (result.status=="success") {
                    this.TotalQuestions = result.data.length;
                }
                else
                    this.errorMessage = result.Message;

            },
            error => {
                this.errorMessage = error.message;
            });
    }
    GetTotalQuickCodes() {
        //debugger;
        this.quickCodeService.GetQuickCode(null).subscribe(
            result => {
                // debugger;
                if (result.status=="success") 
                    this.TotalQuestions = result.data.length;
                else
                    this.errorMessage = result.Message;

            },
            error => {
                this.errorMessage = error.message;
            });
    }

    GetTotalQucikCode() {
        //        debugger;
        this.quickCodeService.GetQuickCode(null).subscribe(
            result => {
                //              debugger;
                if (result.status=="success") 
                    this.TotalQucikCode = result.data.length;
                else
                    this.errorMessage = result.Message;
            },
            error => {
                this.errorMessage = error.message;
            });
    }

    getTest() {
        this.TestService.GetTestById(this.User_ID).subscribe((result: any) => {
            if (result.status=="success") 
            this.ItemsArray = result;
            else
            this.errorMessage = result.Message;


            // this.ItemsArray.forEach((nos) => { // foreach statement  
            //     document.write(" number=:" + nos.TestDat);  
            // })  
        })
    }



}
