import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

const baseUrl = `${environment.apiUrl}/users`;

@Injectable({ providedIn: 'root' })
export class UserService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  private refreshTokenTimeout;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(null);
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(email: string, password: string): any {
    return this.http
      .post<any>(
        `${baseUrl}/authenticate`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        map((user) => {
          this.userSubject.next(user);
          this.startRefreshTokenTimer();
          return user;
        })
      );
  }

  logout(): void {
    this.http
      .post<any>(`${baseUrl}/revoke-token`, {}, { withCredentials: true })
      .subscribe();
    this.stopRefreshTokenTimer();
    this.userSubject.next(null);
    this.router.navigate(['/user/login']);
  }

  refreshToken(): any {
    return this.http
      .post<any>(`${baseUrl}/refresh-token`, {}, { withCredentials: true })
      .pipe(
        map((user) => {
          this.userSubject.next(user);
          this.startRefreshTokenTimer();
          return user;
        })
      );
  }

  register(user: User): any {
    return this.http.post(`${baseUrl}/register`, user);
  }

  verifyEmail(token: string): any {
    return this.http.post(`${baseUrl}/verify-email`, { token });
  }

  forgotPassword(email: string): any {
    return this.http.post(`${baseUrl}/forgot-password`, { email });
  }

  validateResetToken(token: string): any {
    return this.http.post(`${baseUrl}/validate-reset-token`, { token });
  }

  resetPassword(token: string, password: string, confirmPassword: string): any {
    return this.http.post(`${baseUrl}/reset-password`, {
      token,
      password,
      confirmPassword,
    });
  }

  getAll(): any {
    return this.http.get<User[]>(baseUrl);
  }

  getById(id: string): any {
    return this.http.get<User>(`${baseUrl}/${id}`);
  }

  create(params): any {
    return this.http.post(baseUrl, params);
  }

  update(id, params): any {
    return this.http.put(`${baseUrl}/${id}`, params).pipe(
      map((user: any) => {
        // update the current user if it was updated
        if (user.id === this.userValue.id) {
          // publish updated user to subscribers
          user = { ...this.userValue, ...user };
          this.userSubject.next(user);
        }
        return user;
      })
    );
  }

  delete(id: string): any {
    return this.http.delete(`${baseUrl}/${id}`).pipe(
      finalize(() => {
        // auto logout if the logged in user was deleted
        if (id === this.userValue.id) {
          this.logout();
        }
      })
    );
  }

  // helper methods

  private startRefreshTokenTimer(): void {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.userValue.jwtToken.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - 60 * 1000;
    this.refreshTokenTimeout = setTimeout(
      () => this.refreshToken().subscribe(),
      timeout
    );
  }

  private stopRefreshTokenTimer(): void {
    clearTimeout(this.refreshTokenTimeout);
  }
}
