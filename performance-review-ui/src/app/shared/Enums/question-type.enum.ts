import { enumeration } from '../models/common/enumeration.model';

export enum questionType {
  Text = 1,
  RatingAndText = 2,
  SingleChoice = 3,
  RatingScale = 4,
  MultipleChoice = 5,
}

export const questionTypes: enumeration<questionType>[] = [
  { id: questionType.Text, name: 'Text' },
  { id: questionType.RatingAndText, name: 'Rating and Text' },
  { id: questionType.SingleChoice, name: 'Single Choice' },
  { id: questionType.RatingScale, name: 'Rating Scale' },
  { id: questionType.MultipleChoice, name: 'Multiple Choice' },
];
