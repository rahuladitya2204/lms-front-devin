import { Learner } from './Learner.types'
import { User } from './User.types'

export interface Organisation {
  name: string;
  email: string;
  website: string;
  users: User[];
  contactNo: string;
  _id: string;
  logo: string;
  learners: Learner[];
}
