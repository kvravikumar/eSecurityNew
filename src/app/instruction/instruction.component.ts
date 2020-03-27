import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { TestService } from '../services/Test.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.css']
})
export class InstructionComponent implements OnInit {

  AdminContact: string;
  QuestionSetID: string;
  errorMessage: string;
  User_ID: string;
  constructor(private loginService: LoginService, private testService: TestService, private router: Router) { }

  ngOnInit() {
    this.User_ID = sessionStorage.getItem("User_ID");
    this.getAdminContact();
   // this.GetQuestionSet()

  }



  OnStartTest() {

    // if (this.QuestionSetID == "")
    //   this.errorMessage = "Question set is not available. Please contact administrator " + this.AdminContact
    // else
      this.router.navigate(['/test']);
  }
  onBack(){

    this.router.navigate(['/ClientDashboard']);
  }
  GetQuestionSet() {

    this.testService.GetQuestionSet(this.User_ID).subscribe((result) => {
      if (result.status =="success") {
      this.QuestionSetID = result;
      }
      else
      this.errorMessage=result.message;

    }, error => {

      this.errorMessage = error.message;
    });
  }
  getAdminContact() {
    this.loginService.GetQuickCode("WEBPAGE_CONTACT").subscribe((result: any) => {
      if (result.status =="success") {
      this.AdminContact = result.data[0].CodeName;
    }
    else
    this.errorMessage=result.message;

    })
  }

}
