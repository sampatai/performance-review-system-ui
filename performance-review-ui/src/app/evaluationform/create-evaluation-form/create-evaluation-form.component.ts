import { Component, DestroyRef, inject, signal } from '@angular/core';

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
import { DEFAULT_NAME_VALUE } from '../../shared/constants/common.constants';
import { EvaluationFormService } from '../../services/evaluationForm.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ErrorHandlingService } from '../../shared/service/error-handler.service';

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
  protected formBuilder = inject(FormBuilder);
  private evaluationFormService = inject(EvaluationFormService);
  private errorHandler = inject(ErrorHandlingService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  errorMessages = signal<string[]>([]);
  evaluationForms = formEvaluations;
  submitted = signal(false);
  activeQuestionIndex: number | null = null;
  createEvaluationFrom = this.formBuilder.group({
    name: ['', [Validators.required]],
    formEvaluation: [null, [Validators.required]],
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
    this.errorMessages.set([]);
    if (this.createEvaluationFrom.valid) {
      const rawValue = this.createEvaluationFrom.getRawValue();
      const evaluationData: createEvaluationForm = {
        name: rawValue.name ?? '',
        formEvaluation: Number(rawValue.formEvaluation),
        questions: (rawValue.questions || []).map((q: any) => ({
          question: q.question,
          questionType: q.questionType,
          isRequired: q.isRequired,
          addRemarks: q.addRemarks,
          Options: (q.options || []).map((opt: any) => ({
            option: opt.Option,
          })),
          ratingMin: q.ratingMin,
          ratingMax: q.ratingMax,
        })),
      };

      this.evaluationFormService
        .create(evaluationData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.router.navigate(['/evaluationform/template']),
          error: (err) => {
            this.errorHandler.handleHttpError(err, this.errorMessages);
            this.submitted.set(false);
          },
        });
    }
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
      addRemarks: [question?.addRemarks ?? false],
      options: this.formBuilder.array(
        (question?.Options || []).map((opt) =>
          this.formBuilder.group({
            Option: [opt.option || '', Validators.required],
          })
        )
      ),
      ratingMin: [question?.ratingMin, [Validators.min(1), Validators.max(10)]],
      ratingMax: [question?.ratingMax, [Validators.min(1), Validators.max(10)]],
    });
  }
  toggleAccordion(index: number): void {
    this.activeQuestionIndex =
      this.activeQuestionIndex === index ? null : index;
  }
}
