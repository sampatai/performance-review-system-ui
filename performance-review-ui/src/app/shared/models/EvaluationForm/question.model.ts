import { nameValue } from '../common/nameValue.model';

export interface option {
  option: string;
}
export interface question {
  question: string;
  questionType: nameValue;
  isRequired: boolean;
  addRemarks:boolean;
  Options: option[];
  ratingMin?: number;
  ratingMax?: number;
}
export interface setQuestion {
  question: string;
  questionType: number;
  isRequired: boolean;
  addRemarks:boolean;
  Options: option[];
  ratingMin?: number;
  ratingMax?: number;
}
export interface getQuestion extends question {
  questionGuid: string;
}
