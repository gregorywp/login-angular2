import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule }  from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { LoginComponent }  from './components/login.component';
import { WelcomeComponent }  from './components/welcome.component';
import { AuthenticationService }  from './services/authentication.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { AUTH_PROVIDERS } from 'angular2-jwt';

@NgModule({
  imports: [
  	BrowserModule,
    FormsModule,
    HttpModule,
  	RouterModule.forRoot([
      {
      	path: 'login',
      	component: LoginComponent
      },
      { path: '',
        component: WelcomeComponent,
        canActivate: [AuthenticationService],
        children: [
          //if they have been allowed in but have a wrong url go to the welcome page
          { path: '**', redirectTo: '' }
        ]
      },
      // otherwise redirect to login
      {
      	path: '**',
      	redirectTo: 'login'
      }
    ])
  ],
  declarations: [
  	AppComponent,
  	LoginComponent,
  	WelcomeComponent
  ],
  providers: [
    AuthenticationService,
    CookieService
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
