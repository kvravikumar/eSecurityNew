import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'

@Injectable()
export class QuizService {

  baseUrl = environment.baseUrl;
  headerAuthorization = environment.headerAuthorization;

  QuestionSetUrl: string;
  QuestionUrl: string;
  token: string;
  header: any;
  headerSettings: { [name: string]: string | string[]; } = {};
  constructor(private http: HttpClient) {


    //this.QuestionSetUrl = 'http://www.pearltechservices.com/SRQuizApi/QuestionSet/';
    this.QuestionSetUrl =this.baseUrl + 'QuestionSet/';

    //this.QuestionUrl = 'http://www.pearltechservices.com/SRQuizApi/Question/';
    this.QuestionUrl = this.baseUrl + 'Question/';

    this.headerSettings['Authorization'] = 'Basic ' + btoa(this.headerAuthorization);
    this.headerSettings['Content-Type'] = 'application/json';
  }
  get(SetId: string) {
    const httpOptions = { headers: this.headerSettings };
    return this.http.post<any>(this.QuestionUrl + 'GetBySetId/' + SetId, "", httpOptions);

  }
  GetByRandom(UserID: string) {
    const httpOptions = { headers: this.headerSettings };
    return this.http.post<any>(this.QuestionUrl + 'GetByRandom/' + UserID, "", httpOptions);

  }
  //get(url: string) {
  //  return this.http.get(url);
  //}

  getAll() {

    const httpOptions = { headers: this.headerSettings };
    return this.http.post<any>(this.QuestionSetUrl + 'Get', "", httpOptions);
    //return [
    //    { id: 'assets/data/javascript.json', name: 'JavaScript' },
    //    { id: 'assets/data/aspnet.json', name: 'Asp.Net' },
    //    { id: 'assets/data/csharp.json', name: 'C Sharp' },
    //    { id: 'assets/data/designPatterns.json', name: 'Design Patterns' }
    //];
  }

}
