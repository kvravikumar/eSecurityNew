import { Component, OnInit } from '@angular/core';
import { QuizService } from '../services/quiz.service';
import { TestService } from '../services/Test.service';
import { LoginService } from '../services/login.service';
//import { HelperService } from '../services/helper.service';
import { Question, Quiz, QuizConfig } from '../models/index';
import { Option } from 'src/app/models';
import { TestUser } from '../models/TestUser';
import { Router } from '@angular/router';



@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  //styleUrls: ['./quiz.component.css']
})
export class TestComponent implements OnInit {
  warningMessage: boolean = false;
  AdminContact: string;
  CheckPreview: string = "No";
  FirstRecord: boolean = true;
  LastRecord: boolean = false;
  TestTime: number;
  WarningTime: string;
  QuestionSetID: string;
  errorMessage: string
  quizes: any[];
  quiz: Quiz = new Quiz(null);
  //testUser: TestUser = new TestUser(null);
  question: Array<Question> = [];
  mode = 'quiz';
  SuccessMassage: string;
  quizName: string;
  User_ID: string
  testResult: object
  isFirstDisabled = true;
  isNextDisabled = true;
  isPreviouDisabled = false;
  isLastDisabled = false;
  config: QuizConfig = {
    'allowBack': true,
    'allowReview': true,
    'autoMove': false,  // if true, it will move to next question automatically when answered.
    'duration': 1200,  // indicates the time (in secs) in which quiz needs to be completed. 0 means unlimited.
    'pageSize': 1,
    'requiredAll': false,  // indicates if you must answer all the questions before submitting.
    'richText': false,
    'shuffleQuestions': false,
    'shuffleOptions': false,
    'showClock': false,
    'showPager': true,
    'theme': 'none'
  };

  pager = {
    index: 0,
    size: 1,
    count: 1
  };
  timer: any = null;
  startTime: Date;
  endTime: Date;
  ellapsedTime = '00:00';
  duration = '';
  FailMessage: string
  PassMessage: string

  constructor(private router: Router, private quizService: QuizService, private testService: TestService, private loginService: LoginService) {

  }

  transform(time: string): number {
    let split = time.split(':');
    let minutes = split[0];
    let seconds = split[1];
    return parseInt(minutes);
  }

  ngOnInit() {

    this.getTestTime();
    this.User_ID = sessionStorage.getItem("User_ID");

    this.GetQuestionSet();



    this.getAdminContact();

    // if(this.quiz.questions.length-1==this.pager.index)
    // this.CheckPreview=true;

    // this.quizService.getAll().subscribe((response) => {
    //   this.quizes = response;
    //this.quizName = this.quizes[0].SetID;
    // this.quizName = "Set1";
    //  this.quizName=this.QuestionSetID;
    //   this.loadQuiz(this.quizName);

    // }, error => {

    //   this.errorMessage = error.message;
    // });

    //this.quizes = this.quizService.getAll();
    //this.quizName = this.quizes[0].id;
    //this.loadQuiz(this.quizName);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }



  GetQuestionSet() {
    // this.testService.GetQuestionSet(this.User_ID).subscribe((response) => {
    //   if(response=="")
    //   {}
    //   else
    //   {
    //   this.QuestionSetID = response;
    //   this.loadQuiz(this.QuestionSetID);
    //   }
    // }, error => {

    //   this.errorMessage = error.message;
    // });

    this.loadQuiz(this.User_ID);


  }


  getAdminContact() {
    this.loginService.GetQuickCode("WEBPAGE_CONTACT").subscribe((result: any) => {
      if (result.status == "success")
        this.getAdminContact = result.data[0].CodeName;
      else
        this.errorMessage = result.message
    })
  }
  getTestTime() {
    this.loginService.GetQuickCode("TEST_TIME").subscribe((result: any) => {
      if (result.status == "success")
      this.TestTime =  result.data[0].CodeName;
      else
      this.errorMessage = result.message


    })

    this.loginService.GetQuickCode("WARNING_TIME").subscribe((result: any) => {

      if (result.status == "success")
      {

      this.WarningTime = result.data[0].CodeName;

      var ss = (parseInt(this.WarningTime) / 60);

      var sss = ss > 1 ? ss.toFixed() : "0" + ss.toFixed();

      this.WarningTime = sss + ":00";
      }
      else
      this.errorMessage = result.message

    })
  }
  loadQuiz(UserID: string) {
    this.quizService.GetByRandom(UserID).subscribe(result => {
      if (result.status == "success")
      {

      this.quiz = new Quiz(result);
      this.pager.count = this.quiz.questions.length;
      this.startTime = new Date();
      this.ellapsedTime = '00:00';
      this.timer = setInterval(() => { this.tick(); }, 1000);

      this.duration = this.parseTime(this.TestTime);
      }
      else
      this.errorMessage = result.message

    },
      (error) => {
        var ss = error.message;
      }
    );
    this.mode = 'quiz';
  }

  tick() {
    if (this.mode != "result") {
      const now = new Date();
      const diff = (now.getTime() - this.startTime.getTime()) / 1000;
      if (diff >= this.TestTime) {
        //this.onSubmit();
        this.router.navigate(['/ClientDashboard']);
      }
      this.ellapsedTime = this.parseTime(diff);

      if (this.transform(this.ellapsedTime) >= this.transform(this.WarningTime))
        this.warningMessage = true;
      else
        this.warningMessage = false;

    }
  }

  parseTime(totalSeconds: number) {
    let mins: string | number = Math.floor(totalSeconds / 60);
    let secs: string | number = Math.round(totalSeconds % 60);
    mins = (mins < 10 ? '0' : '') + mins;
    secs = (secs < 10 ? '0' : '') + secs;
    return `${mins}:${secs}`;
  }

  get filteredQuestions() {
    return (this.quiz.questions) ?
      this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
  }

  onSelect(question: Question, option: Option) {


    // question.options.forEach((x) => {
    //     x.selected = false;

    // });

    question.options.forEach((x) => {
      if (x.AnswerID !== option.AnswerID) {
        x.selected = false;
      }
    });



    if (this.config.autoMove) {
      this.goTo(this.pager.index + 1);
    }
  }

  onBack() {
    this.router.navigate(['/ClientDashboard']);
  }
  goTo(index: number) {

    if (index >= this.pager.count - 1)
      this.CheckPreview = "Yes";
    else
      this.CheckPreview = "No";

    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      this.mode = 'quiz';
    }

    if (index >= this.pager.count - 1) {
      this.LastRecord = true;
      this.FirstRecord = false;
    }
    else if (index <= 0) {
      this.LastRecord = false;
      this.FirstRecord = true;
    }
    else {
      this.LastRecord = false;
      this.FirstRecord = false;
    }
  }

  isAnswered(question: Question) {
    return question.options.find(x => x.selected) ? true : false;
  };

  isSelected(question: Question) {
    return question.options.find(x => x.selected) ? 'Answered' : 'Not Answered';
  };

  isCorrect(question: Question) {
    //return question.options.every(x => x.selected === x.AnswerInd) ? 'correct' : 'wrong';
  };

  onSubmit() {
    let answers = [];
    this.warningMessage = false;

    // this.quiz.questions[0].options[0].selected=this.quiz.questions[0].options.find(x => x.selected==false) ? false : true;
    //this.testUser.UserID=this.User_ID;
    // this.testUser.CreatedBy=this.User_ID;


    // this.quiz.questions.forEach(x => answers.push({ 'quizId': this.quiz.id, 'questionId': x.id, 'answered': x.answered }));

    // Post your data to the server here. answers contains the questionId and the users' answer.
    //console.log(this.quiz.questions);

    for (var i = 0; i <= this.quiz.questions.length - 1; i++) {

      //var id = this.quiz.questions[i].id
      //var Question = this.quiz.questions[i].name
      //var CorrectAnswer = this.quiz.questions[i].options.find(x => x.isAnswer).name
      //var selected = this.quiz.questions[i].options.find(x => x.selected).name
      //var isAnswer = this.quiz.questions[i].options.every(x => x.selected === x.isAnswer) ? 'correct' : 'wrong';


      //this.quiz.questions[0].options.every(x => x.selected === x.isAnswer) ? 'correct' : 'wrong';
      // this.quiz.questions[0].options.find(x => x.UserSelected) ? true : false;

      this.quiz.questions[i].userid = this.User_ID;
      // this.quiz.questions[i].passInd = this.quiz.questions[i].options.every(x => x.selected === (x.AnswerInd === 'Y' ? true : false)) ? true : false;
      this.quiz.questions[i].options.forEach(function (options) {
        if (options.selected == false)
          options.selected = false;
        else
          options.selected = true;
      });
    }

    this.testService.SubmitTest(this.quiz.questions).subscribe((result) => {

      if(result.status=="success")
      {
      this.testResult = result.data;

      if (this.testResult != null) {
        if (this.testResult[0].TestResult == "F")
          this.FailMessage = "FAILED"
        else
          this.PassMessage = "PASSED"





        // if (testResult != null) {
        //   var ss = testResult[0].TestResult;
        this.duration = "0000";
        this.ellapsedTime = "00:00";
        this.SuccessMassage = 'Test Submitted Successfully';
        // }
      }
      this.errorMessage = result.message;
      }

    }, error => {
      this.errorMessage = error.message;
    });
    // console.log(this.testUser);
    this.mode = 'result';


  }
}
