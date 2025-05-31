import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-validation-message',
  imports:  [CommonModule, ReactiveFormsModule],
  standalone:true,
  templateUrl: './input-validation-message.component.html',
  styleUrl: './input-validation-message.component.css'
})
export class InputValidationMessageComponent {
  control=input.required<AbstractControl| null>();
}
