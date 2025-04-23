/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const BooksController = () => import('#controllers/books_controller')
import router from '@adonisjs/core/services/router'
import { throttle } from './limiter.js'
router.get('/', async () => {
  return {
    hello: 'logique-test',
  }
})

router
  .group(() => {
    router.resource('books', BooksController)
  })
  .prefix('/api')
  .use(throttle)
