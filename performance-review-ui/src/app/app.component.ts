import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './navbar/nav-bar/nav-bar.component';
import { SideBarComponent } from './navbar/side-bar/side-bar.component';
import { FooterComponent } from './navbar/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NavBarComponent,SideBarComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  title = 'performance-review-ui';
}
