import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { column } from '../../models/common/column.model';
import { filter } from '../../models/common/filter.model';
import { PAGINATION_DEFAULTS } from '../../constants/pagination.constants';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-expandable-list',
  imports: [CommonModule, FormsModule,RouterLink],
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

  //Partial<filter> :The emitted object can have some (or none) of Filter's properties
  //Parent components can listen to this event and react.
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
    if (!this.columns.find((c) => c.key == column)?.sortable) return;
    const sortDirection =
      this.search.sortColumn == column && this.search.sortDirection == 'asc'
        ? 'desc'
        : 'asc';
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
    this.expandedRowId = this.expandedRowId === id ? null : id;
  }
  getItemValue(item: any, key: string): any {
    return item?.[key];
  }
  getChildren(item: any): any[] {
    return item?.[this.childrenKey] || [];
  }
}
