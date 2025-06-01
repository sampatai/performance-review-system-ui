import {
  Component,
  EventEmitter,
  Input,
  input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  questionType,
  questionTypes,
} from '../../shared/Enums/question-type.enum';
import { CommonModule } from '@angular/common';
import { option } from '../../shared/models/EvaluationForm/question.model';

@Component({
  selector: 'app-question',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css',
})
export class QuestionComponent {
  @Input({ required: true }) questionForm!: FormGroup;
  @Output() typeChange = new EventEmitter<questionType>();

  questionTypes = questionTypes;

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }
  get showOptionSelection(): boolean {
    const type = this.questionForm.get('questionType')?.value;
    return (
      type === questionType.MultipleChoice || type === questionType.SingleChoice
    );
  }
  get showRatingSection(): boolean {
    const type = this.questionForm.get('type')?.value;
    return (
      type === questionType.RatingScale || type === questionType.RatingAndText
    );
  }
  validate(controlName: string): boolean {
    const control = this.questionForm.get(controlName);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }
 
  addOption(): void {
    this.options.push(this.createOptionForm());
  }
  removeOption(index: number): void {
    this.options.removeAt(index);
  }

   validateOptions(index: number): boolean {
    const option = this.options.at(index) as FormGroup;
    const control = option.get('option');
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }
  
  private createOptionForm(option?: Partial<option>): FormGroup {
    return new FormGroup({
      option: new FormControl(option?.option || '', Validators.required),
    });
  }
   onTypeChange(): void {
    this.typeChange.emit(this.questionForm.get('type')?.value);
  if(!this.showOptionSelection)
    this.options.clear();
  }
  
  showRatingError(): boolean {
    return (
      !!this.questionForm.hasError('invalidRatingRange') &&
      (!!this.questionForm.get('ratingMin')?.dirty ||
        !!this.questionForm.get('ratingMax')?.touched)
    ); //!! (double-bang) converts undefined to false, and truthy values to true,
    //  ensuring the return type is strictly boolean
  }
}
