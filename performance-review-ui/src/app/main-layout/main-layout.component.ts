import { Component } from '@angular/core';
import { FooterComponent } from '../navbar/footer/footer.component';
import { SideBarComponent } from '../navbar/side-bar/side-bar.component';
import { NavBarComponent } from '../navbar/nav-bar/nav-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet,NavBarComponent,SideBarComponent,FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
