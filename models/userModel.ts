import Model from './model'
import { ObjectId } from 'mongodb'

type User = {
  _id: ObjectId | string,
  username: string,
  password: string,
  avatarId: string,
  signature: string,
  email: string,
  website: string,
}

class UserModel extends Model<User> {
  constructor() { super('user') }
}

export default new UserModel()
