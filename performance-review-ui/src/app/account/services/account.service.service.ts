import { HttpClient } from '@angular/common/http';
import { Injectable, model } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Register } from '../../shared/models/accounts/register/Register';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http:HttpClient,
    private route:Router
  ) { }
  register(model:Register){
    return this.http.post(`${environment.appUrl}account/register`,model);
  }
}
