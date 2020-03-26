import { Component, OnInit, ViewChild } from '@angular/core';
import { QuickCodeService } from '../services/QuickCode.Services'
import { LoginService } from '../services/login.service'
import { QuickCode } from '../QuickCode';
import { Observable } from 'rxjs';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { error } from 'util';
import { Router } from '@angular/router';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-quick-code',
  templateUrl: './quick-code.component.html',
  styleUrls: ['./quick-code.component.css']
})
export class QuickCodeComponent {

  dtOptions: DataTables.Settings = {};

  submitted = false;

  PageTitle: string;
  data = false;
  UserForm: any;
  SuccessMassage: string;
  errorMessage: string;
  User_ID: string;
  enableEdit = false;
  enableEditIndex = null;
  ItemsArray = [];
  p: number = 1;
  pagecount: number = 5;
  mode: string;
  SetCategory = [];
  QuickCodeSearchForm: FormGroup;
  quickCodeStatus: string = "A";
  quickCode: QuickCode[] = [];
  editIndex: number = null;
  ItemsArrayExcel = [];

  public QuestionSetStatus = [{ name: 'Active', value: 'A' }, { name: 'In-Active', value: 'I' }];

  // public SetCategory = [{ name: 'Cat1', value:'Cat1' }, { name: 'Cat2', value:'Cat2' }, { name: 'Cat3', value:'Cat3' }];

  // public CandidateUserGroup = [{ name: 'Admin' }, { name: 'Client' }]; 

  constructor(private datePipe: DatePipe, private router: Router, private quickCodeService: QuickCodeService, private loginService: LoginService) {
    this.PageTitle = "New QuickCode";
  }

  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'QuickCode Report :',
    useBom: true,
    noDownload: false,
    headers: ["Code Type", "Code Name", "Code Desc", "Display Seq", "Status", "Remarks", "Created By", "Created Date", "Modify By", "Modifiy Date"]
  };


  get f() { return this.UserForm.controls; }
  ngOnInit() {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };
    this.ItemsArrayExcel = [];
    this.mode = "new";
    this.User_ID = sessionStorage.getItem("User_ID");

    this.UserForm = new FormGroup({
      RecID: new FormControl(),
      CodeType: new FormControl('', Validators.required),
      CodeName: new FormControl('', Validators.required),
      CodeDesc: new FormControl('', Validators.required),
      DisplaySeq: new FormControl('', Validators.required),
      Status: new FormControl('A', Validators.required),
      Remarks: new FormControl(''),
      CreatedBy: new FormControl(this.User_ID),
      CreatedDate: new FormControl(),
      ModifiedBy: new FormControl(this.User_ID),
      ModifiedDate: new FormControl()
    });

    this.QuickCodeSearchForm = new FormGroup({

      SearchValue: new FormControl(''),



    });

    //   this.getQuestionSetStatus();
    //  this.getSetCategory();
    this.GetQuickCode();


    this.UserForm.patchValue({
      Status: "A"

    });

  }
  onQuickCOdeSearch() {

    this.QuickCodeSearchForm.get("SearchValue").valueChanges.subscribe(selectedValue => {
      selectedValue = selectedValue == "" ? null : selectedValue;
      this.getQuickCodeData(selectedValue)                           //latest value of firstname
    })

  }


  getQuickCodeData(selectedValue) {

    this.quickCodeService.GetQuickCode(selectedValue).subscribe((result: any) => {

      if (result.status == "success") {
        result.data.forEach(element => {

          if (element.Status != null && element.Status == "A")
            element.Status = "Active"
          else if (element.Status != null && element.Status == "I")
            element.Status = "In-Active"
          if (element.CreatedDate != null)
            element.CreatedDate = this.datePipe.transform(element.CreatedDate, 'dd-MMM-yyyy');

          if (element.ModifiedDate != null)
            element.ModifiedDate = this.datePipe.transform(element.ModifiedDate, 'dd-MMM-yyyy');

        });

        this.ItemsArray = result.data;
        this.p = 1;
      }
      else {
        this.SuccessMassage = '';
        this.errorMessage = result.message;
      }
    })
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
    this.CreateQuickCode(user);

    this.submitted = false;
  }

  downloadCSV() {
    this.ItemsArrayExcel = this.ItemsArray;
    this.ItemsArrayExcel.forEach(item => delete item.RecID);

    const newData = JSON.parse(JSON.stringify(this.ItemsArrayExcel, (key, value) =>
      value === null || value === undefined
        ? ''    // return empty string for null or undefined
        : value // return everything else unchanged
    ));

    new AngularCsv(newData, "QuickCode Report", this.csvOptions);
    return false;
  }

  CreateQuickCode(quickCode: QuickCode) {

    this.UserForm.patchValue({
      CreatedBy: this.User_ID,
      // CreatedDate: Date.now().toString(),
      ModifiedBy: this.User_ID,
      // ModifiedDate: Date.now().toString()
    });

    //this.UserForm.controls['SetID'].enable();
    const user = this.UserForm.value;
    if (this.PageTitle == "New QuickCode") {
      this.quickCodeService.CreateQuickCode(user).subscribe((result) => {
        if (result.status == "success") {
          this.data = true;
          this.SuccessMassage = result.message;
          this.errorMessage = "";
          this.UserForm.reset();
          this.UserForm.patchValue({ Status: "A" });
          this.PageTitle = "New QuickCode";
          // this.errorMessage = "";
          this.mode = "new";
          this.GetQuickCode();
        }
        else {
          this.SuccessMassage = '';
          this.errorMessage = result.message;
        }
      }, error => {
        this.data = true;
        // this.SuccessMassage = ""
        this.errorMessage = error.message;
      });
    }
    else {
      this.quickCodeService.UpdateQuickCode(user).subscribe((result) => {
        if (result.status == "success") {
          this.data = true;
          this.SuccessMassage = result.message;
          this.errorMessage = "";
          this.UserForm.reset();
          this.UserForm.patchValue({ Status: "A" });
          this.QuickCodeSearchForm.reset();
          this.PageTitle = "New QuickCode";
          // this.errorMessage = "";
          this.mode = "new";
          this.GetQuickCode();
        }
        else {
          this.SuccessMassage = '';
          this.errorMessage = result.message;
        }
      }, error => {
        this.data = true;
        //this.SuccessMassage = "";
        this.errorMessage = error.message;
      });
    }

  }

  onBack() {
    this.router.navigate(['/AdminDashboard']);
  }
  getSetCategory() {
    this.loginService.GetQuickCode("USER_SECTION").subscribe((res: any[]) => {

      this.SetCategory = res;

    })
  }
  GetQuickCode() {
    this.quickCodeService.GetQuickCode(null).subscribe((result: any) => {

      if (result.status == "success") {
        result.data.forEach(element => {

          if (element.Status != null && element.Status == "A")
            element.Status = "Active"
          else if (element.Status != null && element.Status == "I")
            element.Status = "In-Active"

          if (element.CreatedDate != null)
            element.CreatedDate = this.datePipe.transform(element.CreatedDate, 'dd-MMM-yyyy');

          if (element.ModifiedDate != null)
            element.ModifiedDate = this.datePipe.transform(element.ModifiedDate, 'dd-MMM-yyyy');
        });
        this.ItemsArray = result.data;
      }
      else {
        this.SuccessMassage = '';
        this.errorMessage = result.message;
      }

    })
  }

  // getQuestionSetStatus() {

  //   return this.QuestionSetStatus;
  // }
  // getSetCategory() {

  //   return this.SetCategory;
  // }
  onQuestionClick(index: number) {
    this.router.navigate(['/QuickCode'], { queryParams: { SetId: this.ItemsArray[index].SetID } });

  }

  onEditClick(event, index: number) {
    this.errorMessage = "";
    this.SuccessMassage = "";

    if (this.PageTitle == "Update QuickCode")
      this.errorMessage = "Page already in edit mode.";
    else {
      this.mode = "edit";
      this.ItemsArray[index].inedit = true;

      this.UserForm.patchValue({
        RecID: this.ItemsArray[index].RecID,
        CodeType: this.ItemsArray[index].CodeType,
        CodeName: this.ItemsArray[index].CodeName,
        CodeDesc: this.ItemsArray[index].CodeDesc,
        DisplaySeq: this.ItemsArray[index].DisplaySeq,
        Status: this.ItemsArray[index].Status == "Active" ? "A" : "I",
        Remarks: this.ItemsArray[index].Remarks,

      });

      this.PageTitle = "Update QuickCode";
    }
  }



  onCancelClick(index: number) {

    this.UserForm.reset();

    this.PageTitle = "New QuickCode";
    this.errorMessage = ""
    this.mode = "new";
    this.ItemsArray[index].inedit = false;
    this.UserForm.patchValue({
      Status: "A",
    });


  }


}

