import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class LoginComponent implements OnInit {
  myForm: FormGroup
  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    const user = new User(
      this.myForm.value.firstName,
      this.myForm.value.lastName,
      this.myForm.value.email,
      this.myForm.value.password

    );
    this.authService.signin(user)
      .subscribe(
      data => {
        console.log(data)
      },
      error => console.error(error)
      );
    this.myForm.reset();
  }

  ngOnInit() {
    this.myForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
      ]),
      password: new FormControl(null, Validators.required)
    });
  }

}
