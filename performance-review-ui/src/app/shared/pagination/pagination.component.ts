import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

type SortDirection = 'asc' | 'desc';
interface PageChangeEvent {
  page: number;
  search: string;
  sortColumn: string;
  sortDirection: SortDirection;
  pagesize: number;
}

interface TableColumn {
  label: string;
  key: string;
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  @Input() data: any[] = [];
  @Input() totalItems = 0;
  @Input() columns: TableColumn[] = [];

  @Output() pageChange = new EventEmitter<PageChangeEvent>();

  // Signals
  searchTerm = signal('');
  currentPage = signal(1);
  sortColumn = signal('');
  sortDirection = signal<SortDirection>('asc');
  pageSize = signal(10);
  readonly pageSizeOptions = [10, 25, 50, 0] as const;

  constructor() {
    effect(() => {
      const term = this.searchTerm();
      if (term.length >= 3 || term.length === 0) {
        this.currentPage.set(1);
        this.emitChange();
      }
    });
  }

  get totalPages(): number {
    const size = this.pageSize();
    return size === 0 ? 1 : Math.ceil(this.totalItems / size);
  }

  onPageSizeChange(size: number | string): void {
    const newSize = size === 0 ? this.totalItems : +size;
    this.pageSize.set(newSize);
    this.currentPage.set(1);
    this.emitChange();
  }

  onChangePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage.set(page);
      this.emitChange();
    }
  }

  sorting(column: string): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update(dir => dir === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
    this.emitChange();
  }

  private emitChange(): void {
    this.pageChange.emit({
      page: this.currentPage(),
      search: this.searchTerm(),
      sortColumn: this.sortColumn(),
      sortDirection: this.sortDirection(),
      pagesize: this.pageSize(),
    });
  }

  getItemValue(item: any, key: string): any {
    return key.split('.').reduce((o, i) => o?.[i], item);
  }
}