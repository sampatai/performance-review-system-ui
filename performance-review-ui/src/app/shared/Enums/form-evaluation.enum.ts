import { enumeration } from '../models/common/enumeration.model';

export enum formEvaluation {
  ManagerEvaluation = 1,
  PeerEvaluation = 2,
  ProbationEvaluation = 3,
  InternEvaluation = 4,
  ExternalEvaluation = 5,
  SelfEvaluation = 6,
  CustomerClientReviews = 7,
}

export const formEvaluations: enumeration<formEvaluation>[] = [
  { id: formEvaluation.ManagerEvaluation, name: 'Manager Evaluation' },
  { id: formEvaluation.PeerEvaluation, name: 'Peer Evaluation' },
  { id: formEvaluation.ProbationEvaluation, name: 'Probation Evaluation' },
  { id: formEvaluation.InternEvaluation, name: 'Intern Evaluation' },
  { id: formEvaluation.ExternalEvaluation, name: 'External Evaluation' },
  { id: formEvaluation.SelfEvaluation, name: 'Self Evaluation' },
  { id: formEvaluation.CustomerClientReviews, name: 'Customer/Client Reviews' },
];
