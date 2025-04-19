import { CommonModule } from '@angular/common';
import { Component, input} from '@angular/core';

@Component({
  selector: 'app-validation-message',
  imports: [CommonModule],
  templateUrl: './validation-message.component.html',
  styleUrl: './validation-message.component.css',
})
export class ValidationMessageComponent {

  errorMessages = input<string[]>([]);
}
