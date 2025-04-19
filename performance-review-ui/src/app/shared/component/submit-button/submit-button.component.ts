import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'app-submit-button',
  imports: [],
  templateUrl: './submit-button.component.html',
  styleUrl: './submit-button.component.css'
})
export class SubmitButtonComponent {
label=input('Save')
loading=input(false,{transform:booleanAttribute});//Automatically converts attribute strings to booleans


  // Optional inputs with specific types
  variant = input<'primary' | 'secondary'
   | 'success' | 'danger' | 'warning' | 'info' 
   | 'light' | 'dark'>('primary');
  size = input<'sm' | 'lg' | ''>('');//Enforces only allowed values
  class = input('');
}
