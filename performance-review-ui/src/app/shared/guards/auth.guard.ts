import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AccountService } from '../../services/account.service';
import { DestroyRef, inject } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export const authGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const accountService = inject(AccountService);
  const destroyRef = inject(DestroyRef);
  const router = inject(Router);

  const allowedRoles = next.data?.['roles'] as string[] | undefined;
  return accountService.user$.pipe(
    takeUntilDestroyed(destroyRef),
    map((user) => {
      const isAuthenticated = !!user;
      if (!isAuthenticated) {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
      //  No role restriction on route
      if (!allowedRoles || allowedRoles.length === 0) return true;
      //Check if user role matches
      if (allowedRoles.includes(user.role)) return true;
      //Role mismatch → redirect to unauthorized
      router.navigate(['/unauthorized']);
      return false;
    })
  );
};
