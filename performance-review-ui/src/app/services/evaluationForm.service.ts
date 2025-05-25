import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { filter } from "../shared/models/common/filter.model";
import { Observable } from "rxjs";
import { pageList } from "../shared/models/common/pageList.model";
import { getEvaluationForm } from "../shared/models/EvaluationForm/evaluationform.model";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn:'root'
})
export class EvaluationFormService{
 protected http=inject(HttpClient);
 
getEvaluationForms(params:filter):Observable<pageList<getEvaluationForm>>{
    return this.http.post<pageList<getEvaluationForm>>(`${environment.appUrl}evaluationfrom/list`,params);
}
}