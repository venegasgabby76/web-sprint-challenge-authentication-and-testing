// Write your tests here

const supertest = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server");


beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db('users').truncate()
})

afterAll(async () => {
  await db.destroy()
})


describe('Server is working', () => {

  // these are for the register

  it('POST /api/auth/register-Error when password is missing', async () => {
    const res = await supertest(server)
    .post("/api/auth/register")
    .send({ username:"gabbyvenegas76", password:""})
    expect(res.statusCode).toBe(400)
		expect(res.type).toBe("application/json")
  })

  it('POST /api/auth/register', async () => {
    const res = await supertest(server)
    .post("/api/auth/register")
    .send({username:"gvenegas76", password:"abc123"})
    expect(res.statusCode).toBe(201)
		expect(res.type).toBe("application/json")
		// expect(res.body.username).toBe("gvenegas76")
  })

  

  //this is for the login

  it('POST /api/auth/login', async () => {
    const res = await supertest(server)
    .post("/api/auth/login")
    .send({username:"gabbyvenegas76", password:"abc123"})
    expect(res.statusCode).toBe(200)
		expect(res.type).toBe("application/json")
		expect(res.body.message).toBe("welcome to the api', token: token")
  })


  it('POST /api/auth/login-Error when logging in with wrong credentials', async () => {
    const res = await supertest(server)
    .post("/api/auth/login")
    .send({username:"gabbyvenegas76", password:"Abc123"})
    expect(res.statusCode).toBe(401)
		expect(res.type).toBe("application/json")
		expect(res.body.message).toBe("invalid credentials")
  })

 


  // this is for the jokes 

  it("GET /api/jokes-unauthorized", async () => {
    const res = await supertest(server)
    .get("/api/jokes")
		expect(res.statusCode).toBe(400)
	})
})


