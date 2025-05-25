import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PaginationService } from '../../shared/service/pagination.service';
import { EvaluationFormService } from '../../services/evaluationForm.service';
import { column } from '../../shared/models/common/column.model';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
} from 'rxjs';
import { pageList } from '../../shared/models/common/pageList.model';
import { getEvaluationForm } from '../../shared/models/EvaluationForm/evaluationform.model';
import { RouterLink } from '@angular/router';
import { ExpandableListComponent } from "../../shared/component/expandable-list/expandable-list.component";

@Component({
  selector: 'app-evaluation-form-list',
  imports: [CommonModule, RouterLink, ExpandableListComponent],
  standalone:true,
  templateUrl: './evaluation-form-list.component.html',
  styleUrl: './evaluation-form-list.component.css',
})
export class EvaluationFormListComponent {
  protected paginationService = inject(PaginationService);
  protected evaluationFormService = inject(EvaluationFormService);

  evaluationFormColumns: column[] = [
    { label: 'Template Name', key: 'name', sortable: true },
    { label: 'Evaluation Type', key: 'formEvaluation.name' },
  ];
  questionColumns: column[] = [
    { label: 'Question', key: 'name' },
    { label: 'Question Type', key: 'questionType.name' },
    { label: 'Required', key: 'isRequired' },
  ];

  evaluationForms = toSignal(
    toObservable(this.paginationService.stateSignal).pipe(
      debounceTime(100),
      distinctUntilChanged(),
      switchMap((s) =>
        this.evaluationFormService
          .getEvaluationForms(s)
          .pipe(catchError(() => of({ data: [], totalRecords: 0 })))
      )
    ),
    {
      initialValue: {
        data: [],
        totalRecords: 0,
      } as pageList<getEvaluationForm>,
    }
  );
}
