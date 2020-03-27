import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { DatePipe } from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';



import { AppComponent } from './app.component';
import { NavAdminMenuComponent } from './nav-AdminMenu/nav-Adminmenu.component';
import { AdminDashboardComponent } from './adminDashboard/admindashboard.component';
import { ClientDashboardComponent } from './clientDashboard/clientdashboard.component';
import { LoginComponent } from './Login/login.component';
import { TestComponent } from './test/test.component';
import { CandidateComponent } from './candidate/candidate.component';
import { NewQuestionComponent } from './newQuestion/newQuestion.component';
import { QuestionSetComponent } from './question-set/question-set.component';
import { InstructionComponent } from './instruction/instruction.component';


import { QuizService } from 'src/app/services/quiz.service';
import { TestService } from 'src/app/services/Test.service';
import { QuestionSetService } from 'src/app/services/questionSet.service';
import { ReportComponent } from './report/report.component';
import { ViewTestComponent } from './view-test/view-test.component';
import { NavLoginMenuComponent } from './nav-login-menu/nav-login-menu.component';
import { QuickCodeComponent } from './quick-code/quick-code.component';
import { NavFooterComponent } from './nav-footer/nav-footer.component';




@NgModule({
  declarations: [
    AppComponent,
    NavAdminMenuComponent,
    AdminDashboardComponent,
    ClientDashboardComponent,
    TestComponent,
    LoginComponent,
    CandidateComponent,
    NewQuestionComponent,
    QuestionSetComponent,
    InstructionComponent,
    ReportComponent,
    ViewTestComponent,
    NavLoginMenuComponent,
    QuickCodeComponent,
    NavFooterComponent

  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    DataTablesModule,
    FormsModule, ReactiveFormsModule,NgxPaginationModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent, pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'test', component: TestComponent },
      { path: 'AdminDashboard', component: AdminDashboardComponent },
      { path: 'ClientDashboard', component: ClientDashboardComponent },
      { path: 'candidate', component: CandidateComponent },
      { path: 'QuestionSet', component: QuestionSetComponent },
      { path: 'newQuestion', component: NewQuestionComponent },
      { path: 'Instruction', component: InstructionComponent },
      { path: 'report', component: ReportComponent },
      { path: 'viewTest', component: ViewTestComponent },
      { path: 'QuickCode', component: QuickCodeComponent },


    ])
  ],
  providers: [CandidateComponent, AdminDashboardComponent, ClientDashboardComponent, QuizService, TestService, QuestionSetService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {

}
