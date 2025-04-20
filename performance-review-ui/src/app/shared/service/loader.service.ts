import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loadingCount = signal(0);
  readonly loading=computed(() => this.loadingCount() > 0);//Automatically recalculates when dependencies change.
  show(){
    this.loadingCount.set(this.loadingCount() + 1);
  }
  hide(){
    const current = this.loadingCount();
    this.loadingCount.set(current > 0 ? current - 1 : 0);
  }
  
}
