import userModel from '../models/userModel'
import { ObjectId } from 'mongodb'

class UserService {
  async register(username: string, password: string, email: string, website: string) {
    const user = { username, password, email, website }
    return await userModel.insert([user])
  }

  async login(username: string, password: string) {
    return await userModel.find({ username, password })
  }

  async existed(username: string) {
    return await userModel.find({ username }).then(res => res.length !== 0)
  }

  async info(_id: string) {
    return await userModel.find({ _id: new ObjectId(_id) }, { password: 0 })
        .then(res => res.length === 0 ? {} : res[0])
  }

  async signature(_id: string, signature: string) {
    return await userModel.update({ _id: new ObjectId(_id) }, { $set: { signature } })
  }
}

export default new UserService()
