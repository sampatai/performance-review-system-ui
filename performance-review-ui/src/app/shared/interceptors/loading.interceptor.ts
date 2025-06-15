import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { DestroyRef, inject } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from '../service/loader.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export const LoadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const loadingService = inject(LoaderService);
  const destroyRef=inject(DestroyRef);
  loadingService.show();
  return next(req).pipe(takeUntilDestroyed(destroyRef), finalize(() => loadingService.hide()));
};
