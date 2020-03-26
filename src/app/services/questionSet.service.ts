import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { QuestionSet } from "src/app/questionSet";
import { RouterModule, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment'


@Injectable({
    providedIn: 'root'
})
export class QuestionSetService {

    baseUrl = environment.baseUrl;
    headerAuthorization = environment.headerAuthorization;

    Url: string;
    token: string;
    header: any;
    router: Router
    headerSettings: { [name: string]: string | string[]; } = {};
    constructor(private http: HttpClient) {
       
        //this.Url = 'http://www.pearltechservices.com/SRQuizApi/QuestionSet/';

        this.Url =this.baseUrl + 'QuestionSet/';

        this.headerSettings['Authorization'] = 'Basic ' + btoa(this.headerAuthorization);
        this.headerSettings['Content-Type'] = 'application/json';

    }
 

    GetQuestionSet(SearhValue:string) {
       // debugger;
       const httpOptions = { headers: this.headerSettings };
        return this.http.post<any>(this.Url + 'Get/'+SearhValue, "", httpOptions);
    }
    CreateQuestionSet(questionSet: QuestionSet) {
        const httpOptions = { headers: this.headerSettings };
        return this.http.post<any>(this.Url + 'add/', questionSet, httpOptions).pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
         // sessionStorage.setItem('currentUser', JSON.stringify(user));

            return user;
        }));
    }

    DeleteQuestionSet(questionSet: QuestionSet) {
        const httpOptions = { headers: this.headerSettings };
        return this.http.post<any>(this.Url + 'remove/', questionSet, httpOptions).pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
         // sessionStorage.setItem('currentUser', JSON.stringify(user));

            return user;
        }));
    }
    UpdateQuestionSet(candidate: QuestionSet) {
        const httpOptions = { headers: this.headerSettings };
        return this.http.post<any>(this.Url + 'update/', candidate, httpOptions).pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
         // sessionStorage.setItem('currentUser', JSON.stringify(user));

            return user;
        }));
    }

   
}
