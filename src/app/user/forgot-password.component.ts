import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, finalize } from 'rxjs/operators';

import { UserService, AlertService } from '../_services';

@Component({ templateUrl: 'forgot-password.component.html' })
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // convenience getter for easy access to form fields
  get f(): any {
    return this.form.controls;
  }

  onSubmit(): any {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.alertService.clear();
    this.userService
      .forgotPassword(this.f.email.value)
      .pipe(first())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () =>
          this.alertService.success(
            'Please check your email for password reset instructions'
          ),
        error: (error) => this.alertService.error(error),
      });
  }
}
