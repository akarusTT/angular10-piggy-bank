import { Component } from '@angular/core';

import { UserService } from './_services';
import { User, Role } from './_models';

// tslint:disable-next-line: component-selector
@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
  Role = Role;
  user: User;

  constructor(private userService: UserService) {
    this.userService.user.subscribe((x) => (this.user = x));
  }

  logout(): void {
    this.userService.logout();
  }
}
