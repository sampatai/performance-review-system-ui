import { computed, Injectable, signal } from '@angular/core';
import { filter } from '../models/common/filter.model';
import { PAGINATION_DEFAULTS } from '../constants/pagination.constants';


@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  constructor() {}
  private state = signal<filter>({
    page: PAGINATION_DEFAULTS.DEFAULT_PAGE,
    pageSize: PAGINATION_DEFAULTS.DEFAULT_PAGE_SIZE,
    searchTerm: '',
    sortColumn: '',
    sortDirection: PAGINATION_DEFAULTS.SORT_DIRECTION,
  });
//computed signal for stateSignal to derive read-only state.
// This can improve performance and reduce the risk of accidental modifications.
  readonly stateSignal =  computed(() => this.state()); 
  readonly pageSizeOptions: readonly number[] = PAGINATION_DEFAULTS.PAGE_SIZE_OPTIONS; //0 for all records
/**
 * Updates the current filter state with new values.
 * 
 * You can pass only the fields you want to change.
 * The rest of the state stays the same.
 * 
 * Example:
 *   updateState({ page: 2, searchTerm: 'john' });
 *   // Only 'page' and 'searchTerm' will be updated.
 *
 * @param update - An object with the filter fields you want to update.
 */
  updateState(update: Partial<filter>) {
    this.state.update((prevState) => ({ ...prevState, ...update }));
  }
   /**
   * Resets the pagination state to its default values.
   */
  resetState() {
    this.state.set({
      page: PAGINATION_DEFAULTS.DEFAULT_PAGE,
      pageSize: PAGINATION_DEFAULTS.DEFAULT_PAGE_SIZE,
      searchTerm: '',
      sortColumn: '',
      sortDirection: PAGINATION_DEFAULTS.SORT_DIRECTION,
    });
  }
}
