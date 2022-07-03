import userModel from '../models/userModel'
import { ObjectId } from 'mongodb'
import formidable, { Fields, File, Files } from 'formidable'
import path from 'path'
import { Request } from 'express'

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

  async uploadAvatar(req: Request) {
    const form = formidable({
      encoding: 'utf-8',
      keepExtensions: true,
      uploadDir: path.resolve(__dirname, '../public/avatars')
    })

    return await new Promise(resolve => {
      form.parse(req, async (err: Error, fields: Fields, files: Files) => {
        if (err) throw err
        const _id = fields._id as string
        const avatar = files.avatar as File
        const avatarUrl = `/avatars/${ avatar.newFilename }`
        const status = await userModel.update({ _id: new ObjectId(_id) }, { $set: { avatarUrl } })
        resolve(status ? avatarUrl : status)
      })
    })
  }
}

export default new UserService()
