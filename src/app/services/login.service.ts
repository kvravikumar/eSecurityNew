import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Candidate } from "src/app/candidate";
import { RouterModule, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment'


@Injectable({
    providedIn: 'root'
})
export class LoginService {

    baseUrl = environment.baseUrl;

    headerAuthorization = environment.headerAuthorization;

    private currentUserSubject: BehaviorSubject<Candidate>;
    public currentUser: Observable<Candidate>;

    Url: string;
    Urlcommon: string
    token: string;
    header: any;
    router: Router
    httpOptions:string;
     headerSettings: { [name: string]: string | string[]; } = {};

    constructor(private http: HttpClient) {

        // this.Url = 'http://www.pearltechservices.com/SRQuizApi/user/';
        // this.Urlcommon = 'http://www.pearltechservices.com/SRQuizApi/common/';

        this.Url = this.baseUrl + 'user/';
        this.Urlcommon = this.baseUrl + 'common/';


      
        this.headerSettings['Authorization'] = 'Basic ' + btoa(this.headerAuthorization);
        this.headerSettings['Content-Type'] = 'application/json';
            

        this.currentUserSubject = new BehaviorSubject<Candidate>(JSON.parse(sessionStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }
    public get currentUserValue(): Candidate {
        return this.currentUserSubject.value;
    }

    Login(model: any) {
        // debugger;
        const httpOptions = { headers: this.headerSettings };
        return this.http.post<any>(this.Url + 'validate', model, httpOptions).pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            //  this.result=user;
            if (user.status != "" && user.data != null) {
                sessionStorage.setItem('currentUser', JSON.stringify(user.data[0]));
                this.currentUserSubject.next(user.data[0]);
            }
            return user;
        }));

    }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
    GetUsers(SearchValue: string) {
        // debugger;
        const httpOptions = { headers: this.headerSettings };
        return this.http.post<any>(this.Url + 'getuser/' + SearchValue, "", httpOptions);
    }
    GetQuickCode(CodeType: string) {
        // debugger;
        const httpOptions = { headers: this.headerSettings };
        return this.http.post<any>(this.Urlcommon + 'getquickcodes/' + CodeType, "", httpOptions);
    }
    LogNominate(userid: string, createdby: string) {
        // debugger;
        const httpOptions = { headers: this.headerSettings };
        return this.http.post<any>(this.Url + 'addnominate?userid=' + userid + "&createdby=" + createdby, "", httpOptions);
    }
    CreateUser(candidate: Candidate) {
        const httpOptions = { headers: this.headerSettings };
        return this.http.post<any>(this.Url + 'add/', candidate,  httpOptions).pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            // sessionStorage.setItem('currentUser', JSON.stringify(user));

            return user;
        }));
    }
    DeleteUser(candidate: Candidate) {
        const httpOptions = { headers: this.headerSettings };
        return this.http.post<any>(this.Url + 'remove/', candidate, httpOptions).pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            // sessionStorage.setItem('currentUser', JSON.stringify(user));

            return user;
        }));
    }

    UpdateUser(candidate: Candidate) {
        const httpOptions = { headers: this.headerSettings };
        return this.http.post<any>(this.Url + 'update/', candidate, httpOptions).pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            // sessionStorage.setItem('currentUser', JSON.stringify(user));

            return user;
        }));
    }

    checkUsers() {

        if (this.currentUserValue == null)
            this.router.navigate(['/login']);
    }
}
