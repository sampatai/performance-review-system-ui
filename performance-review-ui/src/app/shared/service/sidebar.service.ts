import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private _isSidebarOpen=signal(true);

  get isSidebarOpen(){
    return this._isSidebarOpen.asReadonly();
  }

  toggleSidebar(){
    this._isSidebarOpen.update(state=>!state);
  }
  constructor() { }
}
