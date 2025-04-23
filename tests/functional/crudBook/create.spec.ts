import Book from '#models/book'
import Genre from '#models/genre'
import { test } from '@japa/runner'

test.group('Books CRUD', (group) => {
  group.each.setup(async () => {
    await Book.query().delete()
    await Genre.query().delete()
  })

  test('Create a new book', async ({ client, assert }) => {
    const payload = {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      publishedYear: 2008,
      stock: 5,
      genres: ['Programming', 'Software'],
    }

    const response = await client.post('/api/books').json(payload)
    response.assertStatus(201)
    response.assertBodyContains({ message: 'Book successfully created' })

    const book = await Book.findByOrFail('title', 'Clean Code')
    const genres = await book.related('genre').query()
    assert.equal(genres.length, 2)
  })

  test('Fetch all books', async ({ client, assert }) => {
    await Book.create({
      title: 'Example Book',
      author: 'Someone',
      publishedYear: 2020,
      stock: 1,
    })

    const response = await client.get('/api/books')
    response.assertStatus(200)
    assert.isArray(response.body()?.data || [])
  })

  test('Fetch one book by ID', async ({ client, assert }) => {
    const book = await Book.create({
      title: 'Find Me',
      author: 'Searcher',
      publishedYear: 2022,
      stock: 2,
    })

    const response = await client.get(`/api/books/${book.id}`)
    response.assertStatus(200)
    assert.equal(response.body().data.title, 'Find Me')
  })

  test('Update a book and genres', async ({ client, assert }) => {
    const book = await Book.create({
      title: 'Old Title',
      author: 'Author',
      publishedYear: 2010,
      stock: 3,
    })

    await Genre.createMany([{ name: 'Old Genre', book_id: book.id }])

    const response = await client.put(`/api/books/${book.id}`).json({
      title: 'New Title',
      author: 'New Author',
      publishedYear: 2015,
      stock: 7,
      genres: ['New Genre A', 'New Genre B'],
    })

    response.assertStatus(200)
    assert.equal(response.body().data.title, 'New Title')

    const updatedGenres = await book.related('genre').query()
    assert.equal(updatedGenres.length, 2)
  })

  test('Delete a book and its genres', async ({ client, assert }) => {
    const book = await Book.create({
      title: 'Delete Me',
      author: 'Eraser',
      publishedYear: 2011,
      stock: 0,
    })

    await Genre.create({ name: 'Temp', book_id: book.id })

    const response = await client.delete(`/api/books/${book.id}`)
    response.assertStatus(200)
    response.assertBodyContains({ message: 'Book deleted successfully' })

    const exists = await Book.find(book.id)
    assert.isNull(exists)

    const remainingGenres = await Genre.query().where('book_id', book.id)
    assert.lengthOf(remainingGenres, 0)
  })
})
