import Model from './model'
import { ObjectId } from 'mongodb'

type Article = {
  _id: string | ObjectId,
  title: string,
  digest: string,
  likes: number,
  comments: number,
  coverUrl: string
  coverId: string,
  category: 'technology' | 'life' | 'work' | 'travel'
  created: Date,
  updated: Date,
  deleted: boolean
}

class ArticleModel extends Model<Article> {
  constructor() { super('article') }
}

export default new ArticleModel()
