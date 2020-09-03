import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { UserService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const user = this.userService.userValue;
    if (user) {
      // check if route is restricted by role
      if (route.data.roles && !route.data.roles.includes(user.role)) {
        // role not authorized so redirect to home page
        this.router.navigate(['/']);
        return false;
      }

      // authorized so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/user/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
