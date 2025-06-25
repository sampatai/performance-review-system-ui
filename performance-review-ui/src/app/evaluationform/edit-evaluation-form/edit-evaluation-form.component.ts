import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EvaluationFormListComponent } from '../evaluation-form-list/evaluation-form-list.component';
import { InputValidationMessageComponent } from '../../shared/component/input-validation-message/input-validation-message.component';
import { formEvaluations } from '../../shared/Enums/form-evaluation.enum';
import {
  getQuestion,
  option,
  question,
} from '../../shared/models/EvaluationForm/question.model';
import { getOrEmptyGuid } from '../../shared/utils/default.guid';
import { questionType } from '../../shared/Enums/question-type.enum';
import { QuestionComponent } from '../question/question.component';
import { SubmitButtonComponent } from "../../shared/component/submit-button/submit-button.component";
import { EvaluationFormService } from '../../services/evaluationForm.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { nameValue } from '../../shared/models/common/nameValue.model';

@Component({
  selector: 'app-edit-evaluation-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputValidationMessageComponent,
    QuestionComponent,
    SubmitButtonComponent
  ],
  templateUrl: './edit-evaluation-form.component.html',
  styleUrl: './edit-evaluation-form.component.css',
})
export class EditEvaluationFormComponent implements OnInit {

  protected formBuilder = inject(FormBuilder);
  private evaluationFormService = inject(EvaluationFormService);
  private destroyRef = inject(DestroyRef);
  activeQuestionIndex: number = -1;
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  updateEvaluationForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    formEvaluation: [null as nameValue | null, [Validators.required]],
    questions: this.formBuilder.array<FormGroup>([]),
  });
  submitted = signal(false);
  evaluationForms = formEvaluations;
  evaluationGuid?: string;
  errorMessages = signal<string[]>([]);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        //automatically cancelling any previous request if a new value comes in.
        switchMap((param) => {
          this.evaluationGuid = param.get('id') ?? undefined;
          //observable chain continues gracefully without making an HTTP request.
          return this.evaluationGuid ? this.evaluationFormService.getEvaluationTemplate(this.evaluationGuid) : of(null)
        })
      )
      .subscribe({
        next: (form) => {
          if (form) {
            this.updateEvaluationForm.reset();
            // Map temp to match the form structure if needed
            this.updateEvaluationForm.patchValue(form);
            form.questions.forEach(q => this.questions.push(this.createQuestionForm(q)));

          }
        },
        error: (err) => this.errorMessages.set(['Failed to load user data']),

      })
  }

  get questions(): FormArray<FormGroup> {
    return this.updateEvaluationForm.get('questions') as FormArray<FormGroup>;
  }

  addQuestion(question?: Partial<question>): FormArray {
    return this.updateEvaluationForm.get('questions') as FormArray;
  }

  createQuestionForm(question: Partial<getQuestion>): FormGroup {
    return this.formBuilder.group({
      questionGuid: [getOrEmptyGuid(question?.questionGuid)],
      question: [question?.question || '', Validators.required],
      questionType: [
        question?.questionType || questionType.Text,
        Validators.required,
      ],
      isRequired: [question?.isRequired ?? false],
      addRemarks: [question?.addRemarks ?? false],
      options: this.formBuilder.array(
        (question?.Options || []).map((opt: option) =>
          this.createOptionForm(opt)
        )
      ),
      ratingMin: [question?.ratingMin, [Validators.min(1), Validators.max(10)]],
      ratingMax: [question?.ratingMax, [Validators.min(1), Validators.max(10)]],
    });
  }

  createOptionForm(opt?: Partial<option>): FormGroup {
    return this.formBuilder.group({
      Option: [opt?.option || '', Validators.required],
    });
  }

  toggleAccordion(index: number): void {
    this.activeQuestionIndex = this.activeQuestionIndex === index ? -1 : index;
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

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }
  
  update() {
    throw new Error('Method not implemented.');
  }
}
