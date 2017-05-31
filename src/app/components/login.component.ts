import { Component } from '@angular/core';
import { AuthenticationService }  from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'app/components/login.component.html'
})
export class LoginComponent {
	private model = {
		username : '',
		password : ''
	}
	private error = '';

	constructor(
		private authenticationService: AuthenticationService,
		private router: Router
	){}

	ngOnInit() {
        // reset login status whenever we get kicked back here
        this.authenticationService.logout();
    }

	login() {
        this.error = '';
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(result => {
                if (result.success) {
                	//they made it in, hooray!
                    this.router.navigate(['/']);
                } else {
                	//some sort of error, show error message
                    this.error = result.error;
                }
            });
    }
}