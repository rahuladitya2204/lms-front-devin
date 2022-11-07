export interface Learner {
  email: string;
  name: string;
  recoveryEmail: string;
  username: string;
  contactNo: string;
  isDeactivated: string;
  status: string;
  _id: string;
  createdAt?: '';
}

export interface CreateLearnerPayload extends Learner {}

export interface UpdateLearnerPayload extends Learner {}
