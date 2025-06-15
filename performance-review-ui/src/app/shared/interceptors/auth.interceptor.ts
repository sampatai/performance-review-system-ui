import {
  HttpEvent,
  HttpHandler,
  HttpHandlerFn,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { Observable, switchMap, take } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const accountService = inject(AccountService);
  const destroyRef=inject(DestroyRef);
  return accountService.user$.pipe(
    takeUntilDestroyed(destroyRef),
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
