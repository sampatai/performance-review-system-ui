import {
  HttpEvent,
  HttpHandler,
  HttpHandlerFn,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap, take } from 'rxjs';
import { AccountService } from '../../account/services/account.service.service';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const accountService = inject(AccountService);
  return accountService.user$.pipe(
    take(1),
    switchMap((user) => {
      if (user) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${user?.jwt}`,
          },
        });
      }
      return next(req);
    })
  );
};
