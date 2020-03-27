import { Component, OnInit, ViewChild } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { TestService } from '../services/Test.service';
import { Observable } from 'rxjs';
import { NgForm, FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { error } from 'util';
import { Question } from '../question';
import { Option } from '../models';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
//import { option } from '../option';

@Component({
  selector: 'app-NewQuestion',
  templateUrl: './NewQuestion.component.html'

})
export class NewQuestionComponent {

  mode: string = "New";
  cInd: number = 0;
  chackAnsInd = false;
  //setid: string
  PageTitle: string;
  ButtonTitle: string;
  data = false;
  UserForm: FormGroup;
  SuccessMassage: string;
  errorMessage: string;
  User_ID: string;
  enableEdit = false;
  enableEditIndex = null;
  ItemsArray = [];
  QuestionSequence = []
  fieldArrayBulk = []
  QuestionSetArray = []
  array = [];
  Question: Question[] = [];
  dtOptions: DataTables.Settings = {};
  questionID: string
  p: number = 1;
  pagecount: number = 5;

  get f() { return this.UserForm.controls; }
  get a() { return this.f.AnswersModel as FormArray; }

  //get a1() { return option }

  ngOnInit() {


    this.ButtonTitle = "Save";
    this.PageTitle = "New Question";
    this.UserForm = new FormGroup({
      SetID: new FormControl(''),
      QNo: new FormControl(''),
      QID: new FormControl(''),
      Question: new FormControl('', Validators.required),
      AnswerType: new FormControl(''),
      CreatedBy: new FormControl(''),
      ModifiedBy: new FormControl(''),
      NewAnswerNo: new FormControl('', Validators.required),
      NewAnswer: new FormControl('', Validators.required),
      NewAnswerInd: new FormControl('', Validators.required),
      AnswersModel: new FormArray([])

    });

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true
    };

    this.User_ID = sessionStorage.getItem("User_ID");

    this.getQuesrString();

    this.getQuestion();

    //this.getQuestionSet();


  }



  getQuesrString() {
    this.activatedRoute
      .queryParams
      .subscribe(params => {
        // this.UserForm.get("SetID").patchValue(params['SetId']);
        //this.setid = params['SetId'];
        this.UserForm.patchValue({
          SetID: params['SetId']


        })

      });


    //this.f.array.patchValue(QNo:this.ItemsArray.length+1);


  }

  addFieldValue() {

    this.errorMessage = "";
    this.SuccessMassage = "";
    var AnsNo = this.a.length + 1;
    if (this.f.NewAnswer.value === "") {
      //alert("empty")
      this.errorMessage = "Answer should not be empty "
    }
    else {
      for (let index = 0; index < this.a.length; index++) {
        if (this.f.NewAnswerInd.value == true && this.a.value[index].AnswerInd == this.f.NewAnswerInd.value) {
          this.chackAnsInd = true;
        }
        else
          this.chackAnsInd = false;

      }
      if (this.chackAnsInd != true) {
        this.a.push(this.formBuilder.group({
          AnswerNo: AnsNo,
          AnswerID: "",
          QID: this.questionID,
          Answer: [this.f.NewAnswer.value],
          AnswerInd: [this.f.NewAnswerInd.value],
          CreatedBy: this.User_ID
        }));

        this.f.NewAnswerNo.setValue('');
        this.f.NewAnswer.setValue('');
        this.f.NewAnswerInd.setValue(false);
      }
      else {
        this.errorMessage = "Answer Indicator already selected."

      }

    }

  }


  //  Candidates: Question[] = [];

  private fieldArray: Array<any> = [];
  private input: any = {};
  private newAttribute: any = {};
  unsubcribe: any;



  deleteFieldValue(index) {

    if (this.a.value[index].AnswerID == "") {
      this.a.removeAt(index);
    }
    else {
      var r = confirm("Please confirm!  Do want to delete this answer?");
      if (r == true) {
        this.questionService.DeleteAnswer(this.a.value[index]).subscribe((result) => {
          if (result.status == "succes") {
            this.data = true;
            this.SuccessMassage = 'Answer deleted';
            this.a.removeAt(index);
          }
          else
            this.errorMessage = result.message;
        }, error => {
          this.data = true;
          this.errorMessage = error.message;
        });
      }
      return false;
    }
  }

  editIndex: number = null;

  public QuestionSet = [{ name: 'Admin' }, { name: 'Client' }];


  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private questionService: QuestionService, private testService: TestService, private router: Router) {

  }



  onFormSubmit() {

    this.cInd = 0;

    for (let index = 0; index < this.a.length; index++) {
      if (this.a.value[index].AnswerInd) {
        this.cInd = this.cInd + 1;
      }
    }
    if (this.cInd == 0) {
      this.errorMessage = "Atleast one answer required.";
    }
    else if (this.cInd < 2) {

      this.cInd = 0;

      this.UserForm.value.Question = this.UserForm.value.Question.replace(/[\n\r]+/g, '');
      const user = this.UserForm.value;



      this.CreateQuestion(user);
      // this.f.AnswersModel.reset();

      // for (let index = 0; index < this.a.length; index++) {
      //   this.a.removeAt(index);
      // }
      // this.a.removeAt(0);
      this.a.clear();

    }
    else {
      this.errorMessage = "Answer Indicator already selected."
    }
  }

  getQuestionSet() {
    this.testService.getAll().subscribe((result: any) => {
      if (result.status == "succes")
        this.QuestionSetArray = result.data;
      else
        this.errorMessage = result.message;

    })
  }

  onBack() {
    this.router.navigate(['/QuestionSet']);
  }
  CreateQuestion(candidate: any) {

    this.UserForm.patchValue({
      AnswerType: "OPTION",
      CreatedBy: this.User_ID,
      ModifiedBy: this.User_ID
    });
    //this.UserForm.controls['SetID'].enable();
    const user = this.UserForm.value;
    //this.UserForm.controls['SetID'].disable();
    if (this.PageTitle == "New Question") {
      this.questionService.CreateQuestion(user).subscribe((result) => {
        if (result.status == "succes") {
          this.data = true;
          this.SuccessMassage = result.message;
          this.errorMessage = "";
          // for (let index = 0; index < this.a.length; index++) {
          //   this.a.removeAt(index);

          // }
          this.mode = "New";
          this.enableEdit = false;
          //this.SuccessMassage = '';
          this.UserForm.reset();
          this.getQuesrString();
          this.getQuestion();
        }
        else {
          this.SuccessMassage = "";
          this.errorMessage = result.message;
        }
      }, error => {
        this.SuccessMassage = "";
        this.data = true;
        this.errorMessage = error.message;
      });
    }
    else {

      this.questionService.UpdateQuestion(user).subscribe((result) => {
        if (result.status == "succes") {
          this.data = true;
          this.SuccessMassage = 'Question Updated Successfully';
          this.errorMessage = '';
          this.UserForm.reset();
          this.PageTitle = "New Question";
          this.ButtonTitle = "Save";
          this.enableEdit = false;
          this.mode = "New";
          //this.SuccessMassage = '';
          this.getQuesrString();
          this.getQuestion();
        }
        else {
          this.SuccessMassage = "";
          this.errorMessage = result.message;
        }

      }, error => {
        this.data = true;
        this.SuccessMassage = "";
        this.errorMessage = error.message;
      });
    }
  }

  onDelete() {
    var r = confirm("Please confirm the question want to delete?");
    if (r == true) {
      //this.UserForm.controls['SetID'].enable();
      const user = this.UserForm.value;
      //this.UserForm.controls['SetID'].disable();
      this.questionService.DeleteQuestion(user).subscribe((result) => {
        if (result.status == "succes") {
          this.data = true;
          this.SuccessMassage = result.message;
          this.errorMessage = '';
          this.UserForm.reset();
          this.a.clear();
          this.PageTitle = "New Question";
          this.ButtonTitle = "Save";
          this.enableEdit = false;
          this.getQuesrString();
          this.getQuestion();
          this.mode = "New";
        }
        else {
          this.SuccessMassage = "";
          this.errorMessage = result.message;
        }
      }, error => {
        this.data = true;
        this.SuccessMassage = "";
        this.errorMessage = error.message;
      });
    }
    return false;
  }
  getQuestion() {

    this.questionService.GetQuestion(this.UserForm.value.SetID).subscribe((result: any) => {
      if (result.status == "success") {
        this.ItemsArray = result.data;

        this.UserForm.patchValue({
          QNo: this.ItemsArray.length + 1


        })
      }
      else
        this.errorMessage = result.message;
      // this.UserForm.controls['QNo'].setValue(this.ItemsArray.length+1);
    })


  }



  onEditClick(event, indexNumber: number) {
    if (this.PageTitle == "Update Question") {
      this.errorMessage = "Page already in edit mode.";
      this.SuccessMassage = "";
    }
    else {
      this.mode = "edit";
      this.SuccessMassage = '';
      this.enableEdit = false;
      this.ItemsArray[indexNumber].inedit = true;
      this.UserForm.patchValue({

        SetID: this.ItemsArray[indexNumber].SetID,
        QNo: this.ItemsArray[indexNumber].QNo,
        QID: this.ItemsArray[indexNumber].QID,
        Question: this.ItemsArray[indexNumber].Question,


      });
      this.questionID = this.ItemsArray[indexNumber].QID;
      this.questionService.GetQuestionByID(this.ItemsArray[indexNumber].QID).subscribe((result: any) => {
        //this.ItemsArray = res;
        //this.ItemsArray[indexNumber].inedit = true;
        if (result.status == "succes") {
          for (let index = 0; index < result.data[0].AnswersModel.length; index++) {

            const element = result.data[0].AnswersModel[index];


            var AnsNo = this.a.length + 1;


            this.a.push(this.formBuilder.group({
              AnswerNo: result.data[0].AnswersModel[index].AnswerNo,
              AnswerID: result.data[0].AnswersModel[index].AnswerID,
              QID: result.data[0].AnswersModel[index].QId,
              Answer: result.data[0].AnswersModel[index].Answer,
              AnswerInd: result.data[0].AnswersModel[index].AnswerInd == "Y" ? true : false,
              CreatedBy: this.User_ID

            }));

            this.f.NewAnswerNo.setValue('');
            this.f.NewAnswer.setValue('');
            this.f.NewAnswerInd.setValue(false);
          }
        }
        else
          this.errorMessage = result.message;
      });

      this.ButtonTitle = "Update";
      this.PageTitle = "Update Question";
    }
  }


  onCancelClick(index: number) {

    this.UserForm.reset();
    this.PageTitle = "New Question";
    this.errorMessage = ""
    this.SuccessMassage = ""

    this.enableEdit = false;
    this.ItemsArray[index].inedit = false;
    for (let index = 0; index < this.a.length; index++) {
      this.a.removeAt(index);
    }
    this.a.removeAt(0);

    this.mode = "New";
  }


}
