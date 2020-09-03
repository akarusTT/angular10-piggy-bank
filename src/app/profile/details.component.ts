import { Component } from '@angular/core';

import { UserService } from '@app/_services';

@Component({ templateUrl: 'details.component.html' })
export class DetailsComponent {
  user = this.userService.userValue;

  constructor(private userService: UserService) {}
}
