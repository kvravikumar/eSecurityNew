import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { QuickCode } from "src/app/QuickCode";
import { RouterModule, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment'


@Injectable({
    providedIn: 'root'
})
export class QuickCodeService {

    baseUrl = environment.baseUrl;
    headerAuthorization = environment.headerAuthorization;

    Url: string;
    token: string;
    header: any;
    router: Router
    headerSettings: { [name: string]: string | string[]; } = {};
    constructor(private http: HttpClient) {
      
       // this.Url = 'http://www.pearltechservices.com/SRQuizApi/QuickCode/';

        this.Url = this.baseUrl + 'QuickCode/';

        this.headerSettings['Authorization'] = 'Basic ' + btoa(this.headerAuthorization);
        this.headerSettings['Content-Type'] = 'application/json';

    }
 

    GetQuickCode(selectedValue: string) {
       // debugger;
       const httpOptions = { headers: this.headerSettings };
        return this.http.post<any>(this.Url + 'GetAll/'+selectedValue, "", httpOptions);
    }
    CreateQuickCode(quickCode: QuickCode) {
        const httpOptions = { headers: this.headerSettings };
        return this.http.post<any>(this.Url + 'add/', quickCode, httpOptions).pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
         // sessionStorage.setItem('currentUser', JSON.stringify(user));

            return user;
        }));
    }

    UpdateQuickCode(quickCode: QuickCode) {
        const httpOptions = { headers: this.headerSettings };
        return this.http.post<any>(this.Url + 'update/', quickCode, httpOptions).pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
         // sessionStorage.setItem('currentUser', JSON.stringify(user));

            return user;
        }));
    }

    RemoveQuickCode(quickCode: QuickCode) {
        const httpOptions = { headers: this.headerSettings };
        return this.http.post<any>(this.Url + 'Remove/', quickCode, httpOptions).pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
         // sessionStorage.setItem('currentUser', JSON.stringify(user));

            return user;
        }));
    }

   
}
