import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { User } from '../../shared/models/accounts/user/User';
import { CommonModule } from '@angular/common';
import { AccountService } from '../services/account.service';
import { PaginationComponent } from "../../shared/pagination/pagination.component";
import { filter } from '../../shared/models/common/filter';

@Component({
  selector: 'app-list-user',
  imports: [CommonModule, PaginationComponent],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.css',
})
export class ListUserComponent {
  users$!: Observable<User[]>;
  page = signal(1);
  pageSize = signal(10);
  search = signal('');
  sortColumn = signal('');
  sortDirection = signal<'asc' | 'desc'>('desc');
  filterParams = computed((): filter => ({
    pageNumber: this.page(),
    pageSize: this.pageSize(),
    searchTerm: this.search(),
    sortColumn: this.sortColumn(),
    sortDirection: this.sortDirection(),
  }));
  totalRecords = signal(0);
  
  colums = [
    { label: 'First Name', key: 'firstName' },
    { label: 'Last Name', key: 'lastName' },
    { label: 'Email', key: 'email' },
    { label: 'Team', key: 'team.name' },
    { label: 'Role', key: 'role.name' },
  ];
  constructor(private accountService: AccountService) {
    
    //Whenever params$()
    // changes → result$() emits → users$
    //  and total$ get new values from backend.
    
    // Reactively call API on state change
    effect(() => {
      const params = this.filterParams();
      this.users$ = this.accountService.getUser(params).pipe(
        tap(res => this.totalRecords.set(res.totalRecords)),
        map(res => res.data)
      );
    });
  }

  onPageChange(event: {
    page: number;
    search: string;
    sortColumn: string;
    sortDirection: 'asc' | 'desc';
    pagesize: number;
  }) {
   
    this.page.set(event.page);
    this.pageSize.set(event.pagesize);
    this.search.set(event.search);
    this.sortColumn.set(event.sortColumn);
    this.sortDirection.set(event.sortDirection);
  }
}
