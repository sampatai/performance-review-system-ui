import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { column } from '../../models/common/column.model';
import { filter } from '../../models/common/filter.model';
import { PAGINATION_DEFAULTS } from '../../constants/pagination.constants';
import {  RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  data = input<any[]>([]);
  totalItems = input<number>(0);
  columns = input<column[]>([]);
  state = input.required<filter>();
  pageSizeOptions = input(PAGINATION_DEFAULTS.PAGE_SIZE_OPTIONS);
  editRouteBase=input<string>('');

  // Emits changes to the filter state (e.g., sort, search, pagination)
// Partial<filter> allows sending only the updated parts
  stateChange = output<Partial<filter>>();
  
  constructor() {}

  get totalPages(): number {
    const pageSize = this.state().pageSize;
    return pageSize === 0 ? 1 : Math.ceil(this.totalItems() / pageSize);
  }
  onChangePage(page: number) {
    //triggers an event that the parent component can listen to.
      //It sends an object { page } (short for { page: page }) to the parent.
      //The parent can then react to this change (e.g., fetch new data for the next page).
    if (page >= 1 && page <= this.totalPages) {
      this.stateChange.emit({ page: page });
    }
  }

  onSorting(column: string) {
   // Check if the column is defined as sortable in the columns array
    if (!this.columns().find((c) => c.key === column)?.sortable) return;
    // Determine the new sort direction:
  // - If the same column is clicked again and it was 'asc', toggle to 'desc'
  // - Otherwise, set to 'asc' (default)
    const sortDirection =
      this.state().sortColumn === column && this.state().sortDirection === 'asc'
        ? 'desc'
        : 'asc';
    // Emit the new sorting state to the parent component or listener
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
   return key.split('.').reduce((o: any, i: string) => (o ? o[i] : undefined), item);
  }
  onSearchEnter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.stateChange.emit({
      searchTerm: inputElement.value,
      page: 1,
    });
  }
  getEditRoute(item:any):any[]{
    return [this.editRouteBase(),item]
  }

}
