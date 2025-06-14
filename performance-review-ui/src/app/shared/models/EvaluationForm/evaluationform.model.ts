import { nameValue } from '../common/nameValue.model';
import { getQuestion, question, setQuestion } from './question.model';
 export interface evaluationEntity{
 evaluationFormGuid: string;
 }
export interface evaluationForm {
  name: string;
  formEvaluation: number;
}
export interface getevaluationForm {
  name: string;
  formEvaluation: nameValue;
}
export interface getEvaluationForm extends getevaluationForm,evaluationEntity {
  questions: getQuestion[];
 
}

export interface createEvaluationForm extends evaluationForm {
  questions: setQuestion[];
}
