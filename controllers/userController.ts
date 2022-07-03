import userService from '../services/userService'
import { Request, Response } from 'express'
import { Request as JwtRequest } from 'express-jwt'
import { sign } from 'jsonwebtoken'
import { secretKey } from '../main'

class UserController {
  async register(req: Request, res: Response) {
    const { username, password, email, website } = req.body
    const ids = await userService.register(username, password, email, website)
    const status = Object.keys(ids).length !== 0
    res.status(200)
    res.send({
      msg: status ? 'Register succeed. Please login.' : 'Register failed. Please try again later.',
      status,
    })
  }

  async login(req: Request, res: Response) {
    const { username, password } = req.body
    const rst = await userService.login(username, password)
    res.status(200)
    if (rst.length !== 0) {
      const token = sign(rst[0], secretKey, { expiresIn: '24h' })
      res.send({
        msg: 'Login succeed.',
        status: true,
        token,
        userInfo: { ...rst[0], root: rst[0].username === 'cinnamons' },
      })
    } else res.send({
      msg: 'Login failed. Check your info again.',
      status: false,
    })
  }

  async existed(req: Request, res: Response) {
    const { username } = req.body
    const status = await userService.existed(username)
    res.send({
      code: 200,
      msg: status ? 'Existed.' : 'Not existed.',
      status,
    })
  }

  async info(req: JwtRequest, res: Response) {
    if (req.auth) {
      const { _id } = req.auth
      const userInfo = await userService.info(_id)
      res.status(200)
      res.send({
        status: Object.keys(userInfo).length !== 0,
        msg: 'Get info succeed.',
        userInfo: { ...userInfo, root: userInfo.username === 'cinnamons' },
      })
    }
  }

  async signature(req: Request, res: Response) {
    const { _id, signature } = req.body
    const status = await userService.signature(_id, signature)
    res.status(200)
    res.send({
      status,
      msg: status ? 'Save succeed.' : 'Save failed.'
    })
  }

  async uploadAvatar(req: Request, res: Response) {
    const avatar = await userService.uploadAvatar(req)
    res.status(200)
    res.send({
      msg: avatar ? 'Update succeed.' : 'Update failed.',
      status: !!avatar,
      avatar
    })
  }
}

export default new UserController()
