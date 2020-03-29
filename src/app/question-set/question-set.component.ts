import { Component, OnInit, ViewChild } from '@angular/core';
import { QuestionSetService } from '../services/questionSet.service'
import { LoginService } from '../services/login.service'
import { QuestionSet } from '../questionSet';
import { Observable } from 'rxjs';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { error } from 'util';
import { Router } from '@angular/router';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-question-set',
  templateUrl: './question-set.component.html'

})
export class QuestionSetComponent {

  dtOptions: DataTables.Settings = {};

  submitted = false;
  SeqCount:boolean;

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
  QuestionSetSearchForm: FormGroup;

  questionSet: QuestionSet[] = [];
  editIndex: number = null;

  public QuestionSetStatus = [{ name: 'Active', value: 'A' }, { name: 'In-Active', value: 'I' }];

  // public SetCategory = [{ name: 'Cat1', value:'Cat1' }, { name: 'Cat2', value:'Cat2' }, { name: 'Cat3', value:'Cat3' }];

  // public CandidateUserGroup = [{ name: 'Admin' }, { name: 'Client' }]; 

  constructor(private datePipe: DatePipe, private router: Router, private questionSetService: QuestionSetService, private loginService: LoginService) {
    this.PageTitle = "New Question Set";
  }

  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Question Set Report :',
    useBom: true,
    noDownload: false,
    headers: ["SetID", "SetCategory", "Status", "CreatedBy", "CreatedDate", "ModifyBy", "ModifiyDate"]
  };


  get f() { return this.UserForm.controls; }
  ngOnInit() {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };

    this.mode = "New";
    this.SeqCount=true;
    this.User_ID = sessionStorage.getItem("User_ID");

    this.UserForm = new FormGroup({
      SetID: new FormControl(),
      SetCategory: new FormControl('', Validators.required),
      SeqNo: new FormControl('0', Validators.required),
      Status: new FormControl('A', Validators.required),
      CreatedBy: new FormControl(this.User_ID),
      CreatedDate: new FormControl(),
      ModifiedBy: new FormControl(this.User_ID),
      ModifiedDate: new FormControl()
    });

    this.QuestionSetSearchForm = new FormGroup({
      SearchValue: new FormControl(''),

    });

    this.getQuestionSetStatus();
    this.getSetCategory();
    this.getQuestionSet(null);



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

  downloadCSV($e) {
    $e.preventDefault();
    //this.dtHolidays : JSONDATA , HolidayList : CSV file Name, this.csvOptions : file options
    new AngularCsv(this.ItemsArray, "Question Set Report", this.csvOptions);

  }

  onQuestionSetSearch() {
    this.QuestionSetSearchForm.get("SearchValue").valueChanges.subscribe(selectedValue => {
      selectedValue = selectedValue == "" ? null : selectedValue;
      this.getQuestionSet(selectedValue)
    })
  }

  Createemployee(questionSet: QuestionSet) {

    this.UserForm.patchValue({
      CreatedBy: this.User_ID,
      // CreatedDate: Date.now().toString(),
      ModifiedBy: this.User_ID,
      // ModifiedDate: Date.now().toString()
    });

    this.UserForm.controls['SetID'].enable();
    const user = this.UserForm.value;
    if (this.PageTitle == "New Question Set") {
      this.questionSetService.CreateQuestionSet(user).subscribe((result) => {

        if (result.status == "success") {
          this.data = true;
          this.SuccessMassage = result.message;
          this.errorMessage = "";
          // this.SuccessMassage = '';
          // this.UserForm.reset();
          // this.getUser();
          this.mode = "New";
          this.SeqCount=true;
          this.router.navigate(['/newQuestion'], { queryParams: { SetId: result.data } });
        }
        else {
          this.SuccessMassage = '';
          this.errorMessage = result.message;
        }
      }, error => {
        this.data = true;
        this.SuccessMassage = ""
        this.errorMessage = error.message;
      });
    }
    else {
      this.questionSetService.UpdateQuestionSet(user).subscribe((result) => {
        if (result.status == "success") {
          this.data = true;
          this.SuccessMassage = result.message;
          this.errorMessage = "";
          this.UserForm.reset();
          this.UserForm.patchValue({ Status: "A", SeqNo: "0" });
          this.QuestionSetSearchForm.reset();
          this.PageTitle = "New Question Set";
          // this.errorMessage = "";
          //this.SuccessMassage = '';
          this.mode = "New";
          this.SeqCount=true;
        }
        else {
          this.SuccessMassage = '';
          this.errorMessage = result.message;
        }
        this.getQuestionSet(null);
      }, error => {
        this.data = true;
        this.SuccessMassage = "";
        this.errorMessage = error.message;
      });
    }

  }

  onBack() {
    this.router.navigate(['/AdminDashboard']);
  }
  getSetCategory() {
    this.loginService.GetQuickCode("CATEGORY").subscribe((res: any) => {

      this.SetCategory = res.data;

    })
  }
  getQuestionSet(searchvalue: string) {
    this.questionSetService.GetQuestionSet(searchvalue).subscribe((res: any) => {

      res.data.forEach(element => {

        if (element.Status != null && element.Status == "A")
          element.Status = "Active"
        else if (element.Status != null && element.Status == "I")
          element.Status = "In-Active"

        if (element.CreatedDate != null)
          element.CreatedDate = this.datePipe.transform(element.CreatedDate, 'dd-MMM-yyyy');

        if (element.ModifiedDate != null)
          element.ModifiedDate = this.datePipe.transform(element.ModifiedDate, 'dd-MMM-yyyy');


      });


      this.ItemsArray = res.data;
      this.p = 1;
    })
  }

  getQuestionSetStatus() {

    return this.QuestionSetStatus;
  }
  // getSetCategory() {

  //   return this.SetCategory;
  // }
  onQuestionClick(index: number) {
    this.router.navigate(['/newQuestion'], { queryParams: { SetId: this.ItemsArray[index].SetID } });

  }
  onDelete() {

    var r = confirm("Please confirm the QuestionSet to delete?");
    if (r == true) {
      const user = this.UserForm.value;
      this.questionSetService.DeleteQuestionSet(user).subscribe((result) => {
        if (result.status == "success") {
          this.data = true;
          this.SuccessMassage = result.message;
          this.errorMessage = "";
          this.UserForm.reset();
          this.QuestionSetSearchForm.reset();
          this.PageTitle = "New Question Set";
          //    this.SuccessMassage = '';
          this.getQuestionSet(null);
          this.mode = "New";
          this.SeqCount=true;
        }
        else {
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

  onEditClick(event, index: number) {

    this.errorMessage = "";
    this.SuccessMassage = "";

    if (this.PageTitle == "Update Question Set")
      this.errorMessage = "Page already in edit mode.";
    else {
      this.mode = "edit";
      this.SeqCount=false;
      this.ItemsArray[index].inedit = true;
      this.UserForm.patchValue({
        SetID: this.ItemsArray[index].SetID,
        SeqNo: this.ItemsArray[index].SeqNo,
        Status: this.ItemsArray[index].Status == "Active" ? "A" : "I",
        SetCategory: this.ItemsArray[index].SetCategory,
      });

      this.PageTitle = "Update Question Set";
    }
  }



  onCancelClick(index: number) {

    this.UserForm.reset();
    //  this.UserForm.controls['SetID'].enable();
    this.PageTitle = "New Question Set";
    this.errorMessage = ""
    this.ItemsArray[index].inedit = false;
    this.mode = "New";
    this.SeqCount=true;
    this.UserForm.patchValue({
      Status: "A",
      SeqNo: "0"
    });
  }


}
