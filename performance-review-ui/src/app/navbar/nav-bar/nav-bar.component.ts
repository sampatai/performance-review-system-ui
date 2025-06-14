import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../shared/service/sidebar.service';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
 private sidebarService= inject(SidebarService);

 onToggleSidebar(){
  debugger;
  this.sidebarService.toggleSidebar();
 }
}
