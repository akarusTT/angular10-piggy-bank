﻿import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';

@Component({ templateUrl: 'update.component.html' })
export class UpdateComponent implements OnInit {
  user = this.userService.userValue;
  form: FormGroup;
  loading = false;
  submitted = false;
  deleting = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        title: [this.user.title, Validators.required],
        firstName: [this.user.firstName, Validators.required],
        lastName: [this.user.lastName, Validators.required],
        email: [this.user.email, [Validators.required, Validators.email]],
        password: ['', [Validators.minLength(6)]],
        confirmPassword: [''],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
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
    this.userService
      .update(this.user.id, this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Update successful', {
            keepAfterRouteChange: true,
          });
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (error) => {
          this.alertService.error(error);
          this.loading = false;
        },
      });
  }

  onDelete(): any {
    if (confirm('Are you sure?')) {
      this.deleting = true;
      this.userService
        .delete(this.user.id)
        .pipe(first())
        .subscribe(() => {
          this.alertService.success('User deleted successfully', {
            keepAfterRouteChange: true,
          });
        });
    }
  }
}
