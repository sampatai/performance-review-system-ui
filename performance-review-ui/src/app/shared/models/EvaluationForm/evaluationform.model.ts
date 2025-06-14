import { nameValue } from '../common/nameValue.model';
import { getQuestion, question, setQuestion } from './question.model';

export interface evaluationForm {
  name: string;
  formEvaluation: number;
}
export interface getevaluationForm {
  name: string;
  formEvaluation: nameValue;
}
export interface getEvaluationForm extends getevaluationForm {
  questions: getQuestion[];
  evaluationFormGuid: string;
}

export interface createEvaluationForm extends evaluationForm {
  questions: setQuestion[];
}
