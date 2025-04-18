import { Component, inject } from '@angular/core';
import {
  catchError,
  debounce,
  debounceTime,
  distinctUntilChanged,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { AccountService } from '../services/account.service';
import { RouterLink } from '@angular/router';
import { PaginationService } from '../../shared/service/pagination.service';
import { column } from '../../shared/models/common/column.model';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '../../shared/component/pagination/pagination.component';
import { pageList } from '../../shared/models/common/pageList.model';
import { User } from '../../shared/models/accounts/user/User.model';

@Component({
  selector: 'app-list-user',
  imports: [CommonModule, PaginationComponent, RouterLink],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.css',
})
export class ListUserComponent {
  protected paginationService = inject(PaginationService);
  protected accountService = inject(AccountService);

  columns: column[] = [
    { label: 'First Name', key: 'firstName', sortable: true },
    { label: 'Last Name', key: 'lastName', sortable: true },
    { label: 'Email', key: 'email', sortable: true },
    { label: 'Team', key: 'team.name' },
    { label: 'Role', key: 'role.name' },
  ];

  users = toSignal(
    toObservable(this.paginationService.stateSignal).pipe(
      debounceTime(300), // Adjust debounce time if needed
      distinctUntilChanged(),
      switchMap((state) =>
        this.accountService.getUser(state).pipe(
          catchError(() => of({ data: [], totalRecords: 0 })) // graceful fallback
        )
      )
    ),
    { initialValue: { data: [], totalRecords: 0 } as pageList<User> }
  );
}
