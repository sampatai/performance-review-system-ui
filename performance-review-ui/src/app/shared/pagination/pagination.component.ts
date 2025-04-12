import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  inject,
  Injector,
  Input,
  OnInit,
  Output,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule,FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent  {
  @Input() data: any[] = [];
  @Input() totalItems: number = 0;
  @Input() columns: { label: string; key: string }[] = [];

//The @Output() decorator is used to send data from a child component to its parent.
  @Output() pageChange = new EventEmitter<{
    page: number;
    search: string;
    sortColumn: string;
    sortDirection: 'asc' | 'desc';
    pagesize: number;
  }>();

  searchTerm = signal('');//Manage local state without RxJS
  currentPage = signal(1);
  sortColumn = signal('');
  sortDirection = signal<'asc' | 'desc'>('asc');
  pageSize = signal(10);
  pageSizeOptions: number[] = [10, 25, 50, 0];
  private injector = inject(Injector); // Inject the Injector for DI context
  constructor() {
    // Initialize the search term signal with an empty string
    
  runInInjectionContext(this.injector, () => {
    effect(() =>
      toObservable(this.searchTerm)
      //ensures the stream only emits when the value actually changes.

        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(() => {
          this.currentPage.set(1);
          this.emitChange(); // Notify parent with new search query
        })
    );
  });
  }
 

  get totalPages(): number {
    const size = this.pageSize();
    return size===0?1: Math.ceil(this.totalItems / size);
  }
  onPageSizeChange(size: number) {
   if(size===0) 
    this.pageSize.set(this.totalItems);
    else
    this.pageSize.set(+size);
    this.currentPage.set(1);
    this.emitChange();
  }

  onChangePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage.set(page);
    this.emitChange();
  }
  sorting(column: string) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
    this.emitChange();
  }
  //child needs a way to tell the parent about changes in the data.
  // what change.emit(...) does
  private emitChange() {
    this.pageChange.emit({
      page: this.currentPage(),
      search: this.searchTerm(),
      sortColumn: this.sortColumn(),
      sortDirection: this.sortDirection(),
      pagesize: this.pageSize(),
    });
  
  }
  getItemValue(item: any,key:String):any{
    //reduces the array of keys into a single value (the value of the nested property).
    //reduce() is used here to iterate over the array of keys,
    //  starting from the item object and drilling down
    //  into the nested properties
    return key.split('.').reduce((o, i) => o[i], item);
  }
}
