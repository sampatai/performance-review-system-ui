import { nameValue } from "../common/nameValue.model";
import { getQuestion } from "./question.model";

export interface evaluationForm{
    name:string,
    formEvaluation:nameValue
}
export interface getEvaluationForm extends evaluationForm {
questions:getQuestion[];
evaluationFormGuid:string;
}
