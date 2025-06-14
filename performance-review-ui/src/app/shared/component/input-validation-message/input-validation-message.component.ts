import { CommonModule } from '@angular/common';
import { Component, computed, Input, signal, Signal } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-validation-message',
  imports:  [CommonModule, ReactiveFormsModule],
  standalone:true,
  templateUrl: './input-validation-message.component.html',
  styleUrl: './input-validation-message.component.css'
})
export class InputValidationMessageComponent {
  @Input({ required: true }) control: AbstractControl | null = null;
  @Input() isSubmitted= signal(false) ;

  //computed() is a derived signal — it automatically tracks
  //  dependencies (other signals) and recalculates its value only 
  // when those dependencies change.
  // Show error messages only if the field was touched or the form was 
  // submitted and the field is invalid.
// This automatically updates when 'isSubmitted' or control state changes.
  shouldShowError = computed(() => {
    return !!this.control &&
      (this.control.touched || this.isSubmitted()) &&
      this.control.invalid;
  });
}
