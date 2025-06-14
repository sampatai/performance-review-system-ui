import { Component, EventEmitter, Input, Output } from '@angular/core';
import { column } from '../../models/common/column.model';
import { filter } from '../../models/common/filter.model';
import { PAGINATION_DEFAULTS } from '../../constants/pagination.constants';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-expandable-list',
  imports: [CommonModule, FormsModule,RouterLink],
  standalone: true,
  templateUrl: './expandable-list.component.html',
  styleUrl: './expandable-list.component.css',
})
export class ExpandableListComponent {
  @Input() data: any[] = [];
  @Input() totalPageNumber = 0;
  @Input() columns: column[] = [];
  @Input() childColumns: column[] = [];
  @Input() childrenKey: string = '';
  @Input() search!: filter;
  @Input() pageSizeOptions = PAGINATION_DEFAULTS.PAGE_SIZE_OPTIONS;
  @Input() editRouteBase: string = '';

// Emits changes to the filter state (e.g., sort, search, pagination)
// Partial<filter> allows sending only the updated parts
  @Output() stateChange = new EventEmitter<Partial<filter>>();
  expandedRowId: any = null;
  get totalPages(): Number {
    const pagesize = this.search.pageSize;
    return pagesize == 0 ? 1 : Math.ceil(this.totalPageNumber / pagesize);
  }
  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPageNumber) {
      //triggers an event that the parent component can listen to.
      //It sends an object { page } (short for { page: page }) to the parent.
      //The parent can then react to this change (e.g., fetch new data for the next page).
      this.stateChange.emit({ page });
    }
  }
  onSorting(column: string) {
  // Check if the column is defined as sortable in the columns array
  if (!this.columns.find((c) => c.key == column)?.sortable) return;

  // Determine the new sort direction:
  // - If the same column is clicked again and it was 'asc', toggle to 'desc'
  // - Otherwise, set to 'asc' (default)
  const sortDirection =
    this.search.sortColumn == column && this.search.sortDirection == 'asc'
      ? 'desc'
      : 'asc';

  // Emit the new sorting state to the parent component or listener
  this.stateChange.emit({ sortColumn: column, sortDirection });
}
  onSearchEnter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.stateChange.emit({ searchTerm: inputElement.value, page: 1 });
  }
  getEditRoute(id: any): any[] {
    return [this.editRouteBase, id];
  }
  toggleExpand(id: any) {
    debugger;
    this.expandedRowId = this.expandedRowId === id ? null : id;
  }
  // Accesses nested value using a key path string, e.g.:
// getItemValue(user, "address.city") -> "Brisbane"
  getItemValue(item: any, key: string): any {
    
    return key.split('.')//key.split('.') → Turns the string "user.name" into ['user', 'name'].
    .reduce((o, i) => o[i], item);//.reduce((o, i) => o[i], item) → Starts with the object (item)
                                  //  and drills down through each key (i) in order.
                                  // Example: key = "user.address.city"
                                  // Step 1: item['user'] → { address: { city: "Brisbane" } }
                                  // Step 2: ...['address'] → { city: "Brisbane" }
                                  // Step 3: ...['city'] → "Brisbane"
    
  }
  getChildren(item: any): any[] {
    return item?.[this.childrenKey] || [];
  }
  hasChildren(item: any): boolean {
    const children = this.getChildren(item);
    return Array.isArray(children) && children.length > 0;
  }
}
