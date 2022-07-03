import articleModel from '../models/articleModel'

class ArticleService {
  async getAll() {
    return await articleModel.find()
  }
}

export default new ArticleService()
