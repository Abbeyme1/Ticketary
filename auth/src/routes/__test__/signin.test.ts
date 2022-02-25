import request = require('supertest');
import { app } from "../../app"


it('status 200, successfull signin',async () => {

    await request(app)
    .post('/api/users/signup')
    .send({
      name: "Test",
      email: 'test@test.com', 
      password: 'password'
    })
    .expect(201)

    await request(app)
    .post('/api/users/signin')
    .send({
        'email': 'test@test.com',
        'password': 'password'
    })
    .expect(200);
})

it("status 400, email doesn't exist",async () => {

    await request(app)
    .post('/api/users/signin')
    .send({
        'email': 'test@test.com',
        'password': 'password'
    })
    .expect(400);
})

it("status 400, invalid password",async () => {

    await request(app)
    .post('/api/users/signup')
    .send({
      name: "Test",
      email: 'test@test.com', 
      password: 'password'
    })
    .expect(201)

    await request(app)
    .post('/api/users/signin')
    .send({
        'email': 'test@test.com',
        'password': 'sdgdgdgddg'
    })
    .expect(400);
})


it('status 200, gets valid cookie on successful signin',async () => {

    await request(app)
    .post('/api/users/signup')
    .send({
      name: "Test",
      email: 'test@test.com', 
      password: 'password'
    })
    .expect(201)

    const res = await request(app)
    .post('/api/users/signin')
    .send({
        'email': 'test@test.com',
        'password': 'password'
    })
    .expect(200);

    expect(res.get('Set-Cookie')).toBeDefined()
})