import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: "signup",
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css', '../common/forms.css']
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  errors: string[] = [];

  messagePerErrorCode = {
    min: 'The minimum length is 10 characters',
    uppercase: 'At least one upper case character',
    digits: 'At least one numeric character',
    // "err_user": 'Could not create user'
  };

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['test@gmail.com', Validators.required],
      password: ['Password10', Validators.required],
      confirm: ['Password10', Validators.required]
    });
  }

  ngOnInit() {}

  signUp() {
    const formValue = this.form.value;
    if (formValue.email && formValue.password && formValue.password === formValue.confirm) {
      this.authService.signUp(formValue.email, formValue.password)
        .subscribe(
          () => {
            this.router.navigate(['/']);
            console.log('User created Successfully');
          },
          response => this.errors = response.error.errors
        );
    }
  }
}
