import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Http, Headers, Response } from '@angular/http';
import { AUTH_PROVIDERS, JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthenticationService {
	public currentUser = {};

	constructor( private router: Router, private cookieService:CookieService, private http: Http ){
    }

	//our main function to check if we are logged in or not
	canActivate() {
        this.checkCookie();
        if (this.currentUser != null) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page
        this.router.navigate(['/login']);
        return false;
    }

    //check if we have the right kind of cookie and if so set our user and token from it
    checkCookie(): void {
        var cookieCheck = this.cookieService.get('currentUser');
        if(typeof cookieCheck != 'undefined'){
            this.currentUser = JSON.parse(this.cookieService.get('currentUser'));
            this.setCookie();
        } else {
            this.currentUser = null;
        }
    }

    //set user into cookie, also do this every time a page is checked so their cookie expiry timer resets
    setCookie() {
        //make expire time 2 hours and also will want to update it every time there is activity
        var expireDate = new Date(Date.now() + (1000 * 60 * 60 * 2));
        this.cookieService.put('currentUser', JSON.stringify(this.currentUser),{expires:expireDate});
    }

    login(username: string, password: string): Observable<any> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://138.68.24.97:8080/login/', JSON.stringify({ username: username, password: password }), { headers })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().token;
                if (token) {
                    var jwtHelper = new JwtHelper();

                    //our currentUser will be the decoded token which is an object containing the info
                    this.currentUser = jwtHelper.decodeToken(token);

                    //put user info into cookie so they will stay logged in
                    this.setCookie();

                    // return true to indicate successful login
                    return {
                        success: true
                    };
                } else {
                    // return message to indicate reason for failing.
                    return {
                        success: false,
                        error: response.json().error
                    };
                }
            });
    }

    //clear our user and cookie
    logout(): void {
        this.currentUser = null;
        this.cookieService.remove('currentUser');
    }
}
