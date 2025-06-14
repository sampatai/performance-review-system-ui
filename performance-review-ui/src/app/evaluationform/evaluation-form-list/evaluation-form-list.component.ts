import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { PaginationService } from '../../shared/service/pagination.service';
import { EvaluationFormService } from '../../services/evaluationForm.service';
import { column } from '../../shared/models/common/column.model';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
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
  private destroyRef =inject(DestroyRef);
  evaluationFormColumns: column[] = [
    
    { label: 'Template Name', key: 'name', sortable: true },
    { label: 'Evaluation Type', key: 'formEvaluation.name' },
  ];
  questionColumns: column[] = [
    { label: 'Question', key: 'question' },
    { label: 'Question Type', key: 'questionType.name' },
    { label: 'Required', key: 'isRequired' },
  ];

  evaluationForms = toSignal(
    //toObservable() converts it into an RxJS Observable so we can apply operators like debounceTime and switchMap
    toObservable(this.paginationService.stateSignal).pipe(
      debounceTime(100),//Prevents rapid calls when the pagination state changes quickly.
      distinctUntilChanged(),//Ensures the request only happens if the state (pagination, filter, etc.) actually changes.
      switchMap((s) =>//Cancels the previous request if a new one comes in.
        this.evaluationFormService
          .getEvaluationForms(s)
          .pipe(catchError(() => of({ data: [], totalRecords: 0 })))
      ),
      takeUntilDestroyed(this.destroyRef) //utomatically unsubscribe from the observable when the component is destroyed.s
    ),
    {
      initialValue: {//Converts the observable stream into an Angular Signal.
        //If nothing has been emitted yet (e.g. during app init), the signal uses the initialValue.
        data: [],
        totalRecords: 0,
      } as pageList<getEvaluationForm>,
    }
  );
}
