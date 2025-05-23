import { Component, input, model } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Options {
  value: any;
  label: string;
}

export interface InputField<T> {
  label: string;
  controlName: keyof T;
  type: 'text' | 'number' | 'email' | 'date' | 'select' | 'checkbox';
  options?: Options[];
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.css']
})
export class DynamicInputComponent<T> {
  formGroup = input.required<FormGroup>();
  field = input.required<InputField<T>>();
  submitted = model<boolean>(false);

  // Get the form control with proper typing
  get control(): FormControl {
    const controlName = this.field().controlName;
    return this.formGroup().get(controlName as string) as FormControl;
  }

  // Get the control name as string
  get controlName(): string {
    return this.field().controlName as string;
  }

  // Helper properties for template
  get isSelect(): boolean {
    return this.field().type === 'select';
  }

  get isCheckbox(): boolean {
    return this.field().type === 'checkbox';
  }

  get isDate(): boolean {
    return this.field().type === 'date';
  }

  get isNumber(): boolean {
    return this.field().type === 'number';
  }
}