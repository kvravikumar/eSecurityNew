import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Question } from "src/app/models/question"
import { ResultSummary } from "src/app/models/ResultSummary"
import { map } from 'rxjs/operators';
import { ReportComponent } from '../report/report.component';
import { environment } from 'src/environments/environment'

@Injectable()
export class TestService {

  baseUrl = environment.baseUrl;
  headerAuthorization = environment.headerAuthorization;

  QuestionSetUrl: string;
  QuestionsUrl: string;
  TestUrl: string;
  token: string;
  header: any;
    headerSettings: { [name: string]: string | string[]; } = {};

  constructor(private http: HttpClient) {

    this.QuestionSetUrl = this.baseUrl + 'QuestionSet/';
    this.QuestionsUrl = this.baseUrl + 'Question/';
  this.TestUrl = this.baseUrl + 'Test/';

    this.headerSettings['Authorization'] = 'Basic ' + btoa(this.headerAuthorization);
    this.headerSettings['Content-Type'] = 'application/json';

  }

  get(id) {
    const httpOptions = { headers: this.headerSettings };
    return this.http.post<any>(this.QuestionsUrl + 'GetBySetId/' + id, "", httpOptions);
  }



  getAll() {
    const httpOptions = { headers: this.headerSettings };
    return this.http.post<any>(this.QuestionSetUrl + 'Get', "", httpOptions);
  }

  GetTestById(id) {
    const httpOptions = { headers: this.headerSettings };
    return this.http.post<any>(this.TestUrl + 'GetByUser/' + id, "", httpOptions);
  }

  GetTestModalById(id) {
    const httpOptions = { headers: this.headerSettings };
    return this.http.post<any>(this.TestUrl + 'GetById/' + id, "", httpOptions);
  }
  GetTestReport(resportSummary: ResultSummary) {
    const httpOptions = { headers: this.headerSettings };
    return this.http.post<any>(this.TestUrl + 'GetTestReport/', resportSummary, httpOptions);
  }

  GetTestByUser(id) {
    const httpOptions = { headers: this.headerSettings };
    return this.http.post<any>(this.TestUrl + 'GetByUser/' + id, "", httpOptions);
  }

  GetQuestionSet(id) {
    const httpOptions = { headers: this.headerSettings };
    return this.http.post<any>(this.TestUrl + 'TakeTest/' + id, httpOptions);
  }

  SubmitTest(question: Question[], ) {

   const httpOptions = { headers: this.headerSettings };
    return this.http.post<any>(this.TestUrl + 'add/', question, httpOptions).pipe(map(user => {
      return user;
    }));
  }

}
