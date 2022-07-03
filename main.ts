import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { expressjwt } from 'express-jwt'
import md5 from 'md5'
import path from 'path'
import https from 'https'
import fs from 'fs'

import router from './routes'

const app = express()

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, './https/westcoast.blue.key')),
  cert: fs.readFileSync(path.join(__dirname, './https/westcoast.blue.pem')),
}

app.use(express.static(path.join(__dirname, './public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// CORS跨域资源共享
app.use(cors({
  origin: '*',
}))

// JWT鉴权
export const secretKey = md5(md5(md5('shencong-west-coast-server')))
app.use(expressjwt({
  secret: secretKey,
  algorithms: ['HS256'],
}).unless({ path: [/\/api\/user\/(login|register|existed)/] }))

// 路由
app.use('/api', router)
app.use('/api/jwt', (req: Request, res: Response) => {
  res.status(200)
  res.send({ msg: 'Not Expired.' })
})

// 404 匹配
app.use(notFound)

// 内部出错
app.use(errorHandler)

function notFound(req: Request, res: Response) {
  res.status(404)
  res.send({ msg: 'Not Found.' })
}

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.log(err.status, err.message)
  if (err.status === 401) { // 鉴权失败
    const { inner } = err
    res.status(401)
    res.send({ msg: inner.message })
  } else {
    res.status(err.status || 500)
    res.send({ msg: err.message })
  }
}

const server = https.createServer(httpsOptions, app)

server.listen(8000)
