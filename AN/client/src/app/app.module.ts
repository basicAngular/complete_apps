import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from '../app/auth/auth.service';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/signup/signup.component';
import { AppRouting } from './app.routing';
import { SigninComponent } from './auth/signin/signin.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SigninComponent,

  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRouting,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,

  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
