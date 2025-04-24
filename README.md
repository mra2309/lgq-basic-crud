
# Basic CRUD Application

node js application using adonis framweork 




## API Documentation

#### https://documenter.getpostman.com/view/5227351/2sB2ixkE2X

## API ONLINE 
https://lgq-test.adiferiismail.com/


## Features

- list book with pagination and search
- insert book
- list book by id
- delete book 
- update book 


## Installation 

install dependency

```bash
  npm install
```

 jalankan migrasi

```bash
  node ace migration:run 
```

 jalankan program

```bash
  node ace run --watch
```

## Installation dengan docker

install dependency

```bash
  docker-compose up --build
```

 jalankan migrasi

```bash
  docker exec -it container-name node ace migration:run 
```
## Rate Limit 

dalam program ini saya set rate limit pada 10x hit max per menit , by default ada 3 cara rate limit dengan [redis,memory,database] ,dalam project ini saya menggunakan database 


penjelasan selengkapnya : https://docs.adonisjs.com/guides/security/rate-limiting


```bash
import limiter from '@adonisjs/limiter/services/main'

export const throttle = limiter.define('api', () => {
  return limiter.allowRequests(10).every('1 minute')
})

```
## Input Filter 

dalam project ini menerapkan input filter dengan plugin plugin **vinejs**

dokumentasi : https://docs.adonisjs.com/guides/basics/validation

```bash
export const createBookValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1),
    author: vine.string().trim().minLength(1),
    publishedYear: vine.number().positive().max(new Date().getFullYear()),
    genres: vine.array(vine.string().trim().minLength(1)).minLength(1),
    stock: vine.number(),
  })
)

```
## Transaction

dalam project ini untuk penyimpanan dan update data mengunakan transaction dengan tujuan untuk membuat jika ada proses simpan buku yang gagal maka akan rollback sehingga tidak ada data yang bersifat anonim dari proses gagal input buku dan genre buku , begitupun untuk proses update .

dokumentasi : https://docs.adonisjs.com/guides/testing/database#global-transaction
