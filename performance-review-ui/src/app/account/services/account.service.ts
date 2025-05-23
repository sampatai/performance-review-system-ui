import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { register } from '../../shared/models/accounts/register/register.model';
import { Login } from '../../shared/models/accounts/Login/login.model';
import { map } from 'rxjs/operators';
import { User } from '../../shared/models/accounts/user/user.model';
import { jwtDecode } from 'jwt-decode';
import { Observable, ReplaySubject } from 'rxjs';
import { pageList } from '../../shared/models/common/pageList.model';
import { filter } from '../../shared/models/common/filter.model';
import { staff } from '../../shared/models/accounts/user/userList..model';
import { editRegister } from '../../shared/models/accounts/register/register-edit.model';
import { manager } from '../../shared/models/accounts/register/manager.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  
  private userSource = new ReplaySubject<User | null>(1);//remembers old values and can replay them to new subscribers.
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
  register(model: register) {
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

  getUser(params: filter): Observable<pageList<staff>> {
  
    return this.http.post<pageList<staff>>(`${environment.appUrl}staff/users`,  params);
  }
  getUserById(id:any):Observable<editRegister>{
    return this.http.get<editRegister>(`${environment.appUrl}staff/${id}`);
  }
  updateUser(model: register,id:any) {
    return this.http.put(`${environment.appUrl}staff/${id}`, model);
  }
  getManagers(teamId:number):Observable<manager[]>{
   return this.http
      .get<any[]>(`${environment.appUrl}staff/manager/${teamId}`)
      .pipe(map(m=> m.map(item=>({
        id: item.id,
        fullName:item.name
      }))));
  }
}
