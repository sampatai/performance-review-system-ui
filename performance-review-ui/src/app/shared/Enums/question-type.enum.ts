import { enumeration } from '../models/common/enumeration.model';

export enum questionType {
  Text = 1,
  SingleChoice = 2,
  RatingScale = 3,
  MultipleChoice = 4,
}

export const questionTypes: enumeration<questionType>[] = [
  { id: questionType.Text, name: 'Text' },
  { id: questionType.SingleChoice, name: 'Single Choice' },
  { id: questionType.RatingScale, name: 'Rating Scale' },
  { id: questionType.MultipleChoice, name: 'Multiple Choice' },
];
