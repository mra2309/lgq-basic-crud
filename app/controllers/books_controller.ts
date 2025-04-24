import Book from '#models/book'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Genre from '#models/genre'
import db from '@adonisjs/lucid/services/db'
import { createBookValidator, updateBookValidator } from '#validators/book'

export default class BooksController {
  async index({ request, response }: HttpContext) {
    try {
      let pagination = request.only(['page', 'limit', 'search'])
      const page = Number.parseInt(pagination.page, 10) || 1
      const limit = Number.parseInt(pagination.limit, 10) || 10
      const search = pagination.search || ''

      const books = await Book.query()
        .from('books')
        .select(['id', 'title', 'author', 'publishedYear', 'stock'])
        .preload('genre', (roleQuery) => {
          roleQuery.select('name')
        })
        .if(search, (query) => {
          query.where('title', 'like', `%${search}%`)
        })
        .paginate(page, limit)
      return response.ok({
        status: 'success',
        books,
      })
    } catch (error) {
      return response.status(500).json({ error: 'Something went wrong' })
    }
  }

  async store({ request, response }: HttpContext) {
    const data = request.all()
    const payload = await createBookValidator.validate(data)
    /*untuk keamanan simpan data menggunakan transaksi*/
    const trx = await db.transaction()

    try {
      const { genres, ...bookData } = payload
      const book = await Book.create(bookData, { client: trx })
      const genreData = data.genres.map((name: string) => ({
        name,
        book_id: book.id,
      }))
      await Genre.createMany(genreData, { client: trx })
      await trx.commit()
      /*return id book*/
      data.id = book.id
      return response.created({
        message: 'Book successfully created',
        data: data,
      })
    } catch (error) {
      await trx.rollback()
      console.log(error)
      return response.badRequest({
        message: 'Failed Create Book',
        errors: error.messages,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const books = await Book.findOrFail(params.id)
      await books.load('genre')
      return response.ok({ status: 'success', data: books.serialize() })
    } catch (error) {
      return response.status(404).json({ error: 'Bank not found' })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const booksFind = await Book.findOrFail(params.id)
      const data = request.all()
      const payload = await updateBookValidator.validate(data)
      const { genres, ...bookData } = payload
      const trx = await db.transaction()

      try {
        booksFind.useTransaction(trx)
        booksFind.merge(bookData)
        await booksFind.save()

        await Genre.query({ client: trx }).where('book_id', booksFind.id).delete()

        const newGenres = genres.map((name: string) => ({
          name,
          book_id: booksFind.id,
        }))
        await Genre.createMany(newGenres, { client: trx })
        await trx.commit()
        data.id = booksFind.id
        return response.ok({
          status: 'Updated',
          data,
          error: null,
        })
      } catch (err) {
        await trx.rollback()
        console.log(err)
        return response.badRequest({
          message: 'Failed to update book',
          errors: err.messages || err,
        })
      }
    } catch (error) {
      return response.status(404).json({ error: 'Book not found' })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const bookResult = await Book.findOrFail(params.id)
      await bookResult.delete()
      return response.ok({ message: 'Book deleted successfully' })
    } catch (error) {
      return response.status(404).json({ error: 'Book not found' })
    }
  }
}
