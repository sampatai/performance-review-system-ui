import { nameValue } from '../common/nameValue.model';

export interface option {
  option: string;
}
export interface question {
  question: string;
  questionType: nameValue;
  isRequired: boolean;
  Options: option[];
  ratingMin: Number;
  ratingMax: Number;
}
export interface getQuestion extends question {
  questionGuid: string;
}
