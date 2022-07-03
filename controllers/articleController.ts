import articleService from '../services/articleService'
import { Request, Response } from 'express'

class ArticleController {
  async getAll(req: Request, res: Response) {
    const articles = await articleService.getAll()
    res.status(200)
    res.send({
      status: true,
      articles
    })
  }
}

export default new ArticleController()
