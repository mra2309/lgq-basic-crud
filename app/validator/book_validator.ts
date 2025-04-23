import vine from '@vinejs/vine'

export const bookValidator = vine.object({
  title: vine.string().trim().minLength(1),
  author: vine.string().trim().minLength(1),
  publishedYear: vine.number().positive().max(new Date().getFullYear()),
  genres: vine.array(vine.string().trim().minLength(1)).minLength(1),
  stock: vine.number(),
})
