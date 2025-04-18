import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { column } from '../../models/common/column.model';
import { filter } from '../../models/common/filter.model';
import { PAGINATION_DEFAULTS } from '../../constants/pagination.constants';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  data = input<any[]>([]);
  totalItems = input<number>(0);
  columns = input<column[]>([]);
  state = input.required<filter>();
  pageSizeOptions = input(PAGINATION_DEFAULTS.PAGE_SIZE_OPTIONS);
  stateChange = output<Partial<filter>>();

  constructor() {}

  get totalPages(): number {
    const pageSize = this.state().pageSize;
    return pageSize === 0 ? 1 : Math.ceil(this.totalItems() / pageSize);
  }
  onChangePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.stateChange.emit({ page: page });
    }
  }

  onSorting(column: string) {
    if (!this.columns().find((c) => c.key === column)?.sortable) return;
    const sortDirection =
      this.state().sortColumn === column && this.state().sortDirection === 'asc'
        ? 'desc'
        : 'asc';
    this.stateChange.emit({
      sortColumn: column,
      sortDirection: sortDirection,
    });
  }

  getItemValue(item: any, key: String): any {
    //reduces the array of keys into a single value (the value of the nested property).
    //reduce() is used here to iterate over the array of keys,
    //  starting from the item object and drilling down
    //  into the nested properties
    return key.split('.').reduce((o, i) => o[i], item);
  }
  onSearchEnter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.stateChange.emit({
      searchTerm: inputElement.value,
      page: 1,
    });
  }
}
