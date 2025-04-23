import { test } from '@japa/runner'

test.group('Rate Limiting', () => {
  test('should block after 5 requests in 1 minute', async ({ client, assert }) => {
    for (let i = 0; i < 5; i++) {
      const res = await client.get('/api/books')
      res.assertStatus(200)
    }

    /*request ke 6 akan ke block karena kita sudah jalankan crud 5 hit 
    dan di tambah rate limit 5 hit */
    const res = await client.get('/api/books')
    res.assertStatus(429)
    assert.equal(res.body().message, 'Too many requests')
  })
})
