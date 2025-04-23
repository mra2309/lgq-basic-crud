import { DateTime } from 'luxon'
import { BaseModel, beforeDelete, column, computed, hasMany } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import Genre from './genre.js'

export default class Book extends BaseModel {
  public static hidden = ['genre', 'title']
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare author: string

  @column()
  declare publishedYear: number

  @column()
  declare stock: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime

  @hasMany(() => Genre, {
    foreignKey: 'book_id',
    serializeAs: null,
  })
  public genre!: relations.HasMany<typeof Genre>

  @computed()
  public get genres() {
    return this.genre?.map((g) => g.name) || []
  }

  @beforeDelete()
  public static async deleteGenres(book: Book) {
    await Genre.query().where('book_id', book.id).delete()
  }
}
