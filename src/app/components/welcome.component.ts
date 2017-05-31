import { Component } from '@angular/core';
import { AuthenticationService }  from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'app/components/welcome.component.html'
})
export class WelcomeComponent {
	constructor(
		private authenticationService: AuthenticationService,
		private router: Router
	){}

	getUserInfo(){
		return JSON.stringify(this.authenticationService.currentUser);
	}

	logout(){
		//all we have to do to log out is go to the login screen, rest is automatic
		this.router.navigate(['/login']);
	}
}