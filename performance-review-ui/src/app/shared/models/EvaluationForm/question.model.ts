import { nameValue } from '../common/nameValue.model';

export interface option {
  option: string;
}
export interface questionEntity{
  questionGuid: string;
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
export interface getQuestion extends question,questionEntity {
  
}
export interface setQuestion {
  question: string;
  questionType: number;
  isRequired: boolean;
  addRemarks:boolean;
  options: option[];
  ratingMin?: number;
  ratingMax?: number;
}
export interface updateQuestion extends setQuestion,questionEntity{
}

