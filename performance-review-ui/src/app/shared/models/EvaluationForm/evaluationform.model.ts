import { nameValue } from '../common/nameValue.model';
import { getQuestion, question } from './question.model';

export interface evaluationForm {
  name: string;
  formEvaluation: nameValue;
}
export interface getEvaluationForm extends evaluationForm {
  questions: getQuestion[];
  evaluationFormGuid: string;
}

export interface createEvaluationForm extends evaluationForm {
  questions: question[];
}
