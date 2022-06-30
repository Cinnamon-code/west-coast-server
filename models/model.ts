import { Collection, MongoClient, ObjectId, Sort } from 'mongodb'
import config from '../config/mongodb.config'

class Model<T> {
  private db: Collection<any> | undefined

  constructor(private collectionName: string) {
    MongoClient.connect(config.HOST, (err, db) => {
      if (err) throw err
      this.db = db?.db(config.DATABASE).collection(collectionName)
    })
  }

  async insert(contents: Partial<T>[]): Promise<{ [key: number]: ObjectId }> {
    return (await this.db?.insertMany(contents).then(r => r.insertedIds)) ?? {}
  }

  async find(condition: Partial<T> = {}, projection: Partial<Record<keyof T, 0 | 1>> = {}): Promise<Partial<T>[]> {
    return await this.db?.find(condition, { projection }).toArray() as Partial<T>[]
  }

  async findNTop(condition: Partial<T> = {}, projection: Partial<Record<keyof T, 0 | 1>> = {},
                 sort: Partial<Record<keyof T, 1 | -1>> = {}, limit: number): Promise<Partial<T>[]> {
    return await this.db?.find(condition, { projection }).sort(sort as Sort).limit(limit).toArray() as Partial<T>[]
  }

  async update(condition: Partial<T> = {}, updates: { $set: Partial<T> } = { $set: {} }): Promise<boolean> {
    return await this.db?.updateMany(condition, updates).then(r => r.matchedCount)
  }
}

export default Model
