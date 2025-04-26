const mongoose = require('mongoose')
const request = require('supertest')

const authService = require('../services/auth.service')
const userService = require('../services/user.services')

const app = require('../app')

require('dotenv').config()

// Connecting to MongoDB before each test
beforeEach(async()=> {  // διαδικασία του jest 
  await mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connection to MongoDB established for jest")
  },
  err => {
    console.log("Failed to connect to MongoDB for jest", err)
  })
}) 

// Close connection to MongoDB after each test
afterEach(async()  => {
  await mongoose.connection.close()
})

describe("Requests for /api/users", () => {

  let token;
  // Πριν τρέξει τα τεστ
  beforeAll(() => {
    user = {
      username: "user1",
      email: "user1@aueb.gr",
      roles: ["READER", "ADMIN"]
    }
    token = authService.generateAccessToken(user)
  })

  it("GET Returns all users", async () => {  // εκτός απο it μπορούμε και test είναι το ίδιο
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBe(true) // ή toBeTruthy
    expect(res.body.data.length).toBeGreaterThan(0)
  }, 50000)

  it("POST Creates a user", async() => {

    const testUser = {
      'username':'test1',
      'password':'12345',
      'name':'test1 name',
      'surname':'test1 surname',
      'email':'test1@aueb.gr',
      'address': {
        'area':'test area',
        'road':'test road'
      }
    }

    const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(testUser)

        expect(res.statusCode).toBe(200)
        expect(res.body.status).toBe(true) // ή toBeTruthy
  }, 50000)

  it("POST creates a user that exists with same username", async() => {
    const testUser2 = {
      'username':'test1',
      'password':'12345',
      'name':'test1 name',
      'surname':'test1 surname',
      'email':'test1@aueb.gr',
      'address': {
        'area':'test area',
        'road':'test road'
      }
    }

    const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(testUser2)   // already exists

        expect(res.statusCode).toBe(400)
        expect(res.body.status).toBe(false) // ή not.toBeTruthy()
  })

  it("POST Creates a user with the same email", async() => {
    const testUser3 = {
      'username':'test6',
      'password':'12345',
      'name':'test6 name',
      'surname':'test6 surname',
      'email':'test1@aueb.gr',
      'address': {
        'area':'test6 area',
        'road':'test6 road'
      }
    }

    const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(testUser3)   // already exists

        expect(res.statusCode).toBe(400)
        expect(res.body.status).not.toBeTruthy() // ή .toBe(false)
  })

  it("POST Creates a user with empty name, surname, password", async() => {
    const userTest4 = {
      'username':'test6',
      'password':'',
      'name':'',
      'surname':'',
      'email':'test6@aueb.gr',
      'address': {
        'area':'test6 area',
        'road':'test6 road'
      }
    }

    const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(userTest4)

        expect(res.statusCode).toBe(400)
        expect(res.body.status).not.toBeTruthy()
  })
})

describe("Requests for /api/user/:username", () => {
  let token;

  beforeAll(() => {
    user = {
      username: "user1",
      email: "user1@aueb.gr",
      roles: ["READER", "ADMIN"]
    }
    token = authService.generateAccessToken(user)
  })

  it('GET Returns specific a user', async() => {

    const result = await userService.findLastInsertedUser()
    console.log("RESULT >>>", result)

    const res = await request(app)
              .get('/api/users/' + result.username)
              .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.status).toBeTruthy() // ή .toBe(true)
      expect(res.body.data.username).toBe(result.username)
      expect(res.body.data.email).toBe(result.email)
  })

  it("PATCH Update a user", async () => {
    const result = await userService.findLastInsertedUser()

    const updatedUser = {
      username: result.username,
      name: 'new updated name',
      surname: 'new updated surname',
      email: 'new@aueb.gr',
      address: {
        area: 'new area',
        road: 'new road'
      }
    }

    const res = await request(app)
              .patch('/api/users/' + result.username)
              .set('Authorization', `Bearer ${token}`)
              .send(updatedUser)

      expect(res.statusCode).toBe(200)
      expect(res.body.status).toBeTruthy() // ή .toBe(true)
  })

  it("DELETE delete a user", async() => {
    const result = await userService.findLastInsertedUser()

    const res = await request(app)
              .delete('/api/users/' + result.username)
              .set('Authorization', `Bearer ${token}`)
              
      expect(res.statusCode).toBe(200)
      expect(res.body.status).toBeTruthy() // ή .toBe(true)
  })
})