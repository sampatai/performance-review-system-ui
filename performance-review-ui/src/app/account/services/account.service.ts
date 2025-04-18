import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Register } from '../../shared/models/accounts/register/Register.model';
import { Login } from '../../shared/models/accounts/Login/Login..model';
import { map } from 'rxjs/operators';
import { User } from '../../shared/models/accounts/user/User.model';
import { jwtDecode } from 'jwt-decode';
import { Observable, ReplaySubject } from 'rxjs';
import { pageList } from '../../shared/models/common/pageList.model';
import { filter } from '../../shared/models/common/filter.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private userSource = new ReplaySubject<User | null>(1);
  user$ = this.userSource.asObservable();
  refreshTokenTimeout: any;
  timeoutId: any;
  constructor(private http: HttpClient, private route: Router) {
    const user = this.loadUserFromLocalStorage();
    if (user) {
      this.userSource.next(user);
    } else {
      this.userSource.next(null); // Emit null if no user found
    }
  }

  private loadUserFromLocalStorage(): User | null {
    const userJson = localStorage.getItem(environment.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }
  register(model: Register) {
    return this.http.post(`${environment.appUrl}account/register`, model);
  }
  login(model: Login) {
    
    return this.http
      .post<User>(`${environment.appUrl}account/login`, model)
      .pipe(
        map((user: User) => {
          if (user && user.jwt) {
            this.setUser(user);
          }
        })
      );
  }
  private setUser(user: User) {
    this.refreshTokentimerStop();
    this.refreshTokenTimerStart(user.jwt);
    localStorage.setItem(environment.userKey, JSON.stringify(user));
    this.userSource.next(user);
  }
  private refreshTokentimerStop() {
    clearTimeout(this.refreshTokenTimeout);
  }
  private refreshTokenTimerStart(jwt: string) {
    const decodeToken: any = jwtDecode(jwt);
    const expires = new Date(decodeToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - 30 * 1000;

    this.refreshTokenTimeout = setTimeout(() => this.refreshToken, timeout);
  }
  refreshToken = async () => {
    this.http
      .post<User>(`${environment.appUrl}account/refresh-token`, {})
      .subscribe({
        next: (user: User) => {
          if (user) {
            this.setUser(user);
          }
        },
        error: (error) => {},
      });
  };

  getUser(params: filter): Observable<pageList<User>> {
  
    return this.http.post<pageList<User>>(`${environment.appUrl}staff/users`,  params);
  }
}
