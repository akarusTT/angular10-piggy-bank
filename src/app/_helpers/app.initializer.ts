import { UserService } from '@app/_services';

export function appInitializer(userService: UserService): any {
  return () =>
    new Promise((resolve) => {
      // attempt to refresh token on app start up to auto authenticate
      userService.refreshToken().subscribe().add(resolve);
    });
}
