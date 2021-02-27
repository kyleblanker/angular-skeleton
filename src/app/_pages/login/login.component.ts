import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  invalid: Boolean = false;
  errorMessage: String = "";
  form: FormGroup;
  submitting: Boolean = false;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { 
    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  submit() {
    if(this.form.valid) {
      var username = this.form.value.username;
      var password = this.form.value.password;
      this.invalid = false;
      this.submitting = true;
      this.authService.login(username,password).subscribe(_ => {
        this.router.navigate(['home']);
      }, error => {
        this.submitting = false;
        this.invalid = true;
        if('error' in error && 'message' in error.error) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = "An unknown error has occurred, please try again later.";
        }
      });
    }
  }
}
