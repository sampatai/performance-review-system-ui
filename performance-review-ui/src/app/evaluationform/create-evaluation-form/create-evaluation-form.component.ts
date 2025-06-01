import { Component, inject, signal } from '@angular/core';

import { formEvaluations } from '../../shared/Enums/form-evaluation.enum';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputValidationMessageComponent } from '../../shared/component/input-validation-message/input-validation-message.component';
import { question } from '../../shared/models/EvaluationForm/question.model';
import { questionType } from '../../shared/Enums/question-type.enum';
import { QuestionComponent } from '../question/question.component';
import { SubmitButtonComponent } from '../../shared/component/submit-button/submit-button.component';
import { createEvaluationForm } from '../../shared/models/EvaluationForm/evaluationform.model';

@Component({
  selector: 'app-create-evaluation-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputValidationMessageComponent,
    QuestionComponent,
    SubmitButtonComponent,
  ],
  templateUrl: './create-evaluation-form.component.html',
  styleUrl: './create-evaluation-form.component.css',
})
export class CreateEvaluationFormComponent {
  private formBuilder = inject(FormBuilder);

  evaluationForms = formEvaluations;
  submitted = signal(false);
  activeQuestionIndex: number | null = null;
  createEvaluationFrom = this.formBuilder.group({
    name: ['', [Validators.required]],
    formEvaluation: ['', [Validators.required]],
    questions: this.formBuilder.array<FormGroup>([]),
  });

  get questions(): FormArray<FormGroup> {
    return this.createEvaluationFrom.get('questions') as FormArray<FormGroup>;
  }
  addQuestion(question?: Partial<question>): void {
    this.questions.push(this.createQuestionForm(question));
    this.activeQuestionIndex = this.questions.length - 1;
  }
  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }
  onQuestionTypeChange(event: Event, questionForm: FormGroup): void {
    const selectElement = event.target as HTMLSelectElement;
    const type = selectElement.value as unknown as questionType;
    if (
      type !== questionType.SingleChoice &&
      type !== questionType.MultipleChoice
    ) {
      const options = questionForm.get('options') as FormArray;
      options?.clear();
    }
  }
  create() {
    this.submitted.set(true);
    const formData = this.createEvaluationFrom.getRawValue();
  }
  //partial allows sending only the updated parts
  private createQuestionForm(question?: Partial<question>): FormGroup {
    return this.formBuilder.group({
      question: [question?.question || '', Validators.required],
      questionType: [
        question?.questionType || questionType.Text,
        Validators.required,
      ],
      isRequired: [question?.isRequired ?? false],
      options: this.formBuilder.array(
        (question?.Options || []).map((opt) =>
          this.formBuilder.group({
            Option: [opt.option || '', Validators.required],
          })
        )
      ),
      ratingMin: [
        question?.ratingMin ?? 1,
        [Validators.min(1), Validators.max(10)],
      ],
      ratingMax: [
        question?.ratingMax ?? 5,
        [Validators.min(1), Validators.max(10)],
      ],
    });
  }
  toggleAccordion(index: number): void {
    this.activeQuestionIndex =
      this.activeQuestionIndex === index ? null : index;
  }
}
