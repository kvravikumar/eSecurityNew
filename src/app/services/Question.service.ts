import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Question } from "src/app/question";
import { Option } from "src/app/option";
import { RouterModule, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment'


@Injectable({
    providedIn: 'root'
})
export class QuestionService {

    baseUrl = environment.baseUrl;
    headerAuthorization = environment.headerAuthorization;

    Url: string;
    UrlAnswer: string;
    token: string;
    header: any;
    router: Router
    headerSettings: { [name: string]: string | string[]; } = {};
    constructor(private http: HttpClient) {
        //   this.Url = 'http://www.pearltechservices.com/SRQuizApi/Question';
        //   this.UrlAnswer = 'http://www.pearltechservices.com/SRQuizApi/Answer';

        this.Url = this.baseUrl + 'Question';
        this.UrlAnswer = this.baseUrl + 'Answer';


        this.headerSettings['Authorization'] = 'Basic ' + btoa(this.headerAuthorization);
        this.headerSettings['Content-Type'] = 'application/json';
    }

    GetQuestion(id: string) {
        // debugger;
        const httpOptions = { headers: this.headerSettings };
        return this.http.post<any>(this.Url + '/GetBySetId/' + id, "", httpOptions);
    }

    GetQuestionByID(id: string) {
        // debugger;
        const httpOptions = { headers: this.headerSettings };
        return this.http.post<any>(this.Url + '/GetById/' + id, "", httpOptions);
    }

    CreateQuestion(question: Question) {
        const httpOptions = { headers: this.headerSettings };
        return this.http.post<any>(this.Url + '/add/', question, httpOptions).pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            // localStorage.setItem('currentUser', JSON.stringify(user));

            return user;
        }));
    }

    UpdateQuestion(question: Question) {
        const httpOptions = { headers: this.headerSettings };
        return this.http.post<any>(this.Url + '/update/', question, httpOptions).pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            sessionStorage.setItem('currentUser', JSON.stringify(user));

            return user;
        }));
    }
    DeleteAnswer(option: Option) {
        const httpOptions = { headers: this.headerSettings };
        return this.http.post<any>(this.UrlAnswer + '/remove/', option, httpOptions).pipe(map(user => {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        }));
    }
    DeleteQuestion(question: Question) {
        const httpOptions = { headers: this.headerSettings };
        return this.http.post<any>(this.Url + '/remove/', question, httpOptions).pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            sessionStorage.setItem('currentUser', JSON.stringify(user));

            return user;
        }));
    }

}
