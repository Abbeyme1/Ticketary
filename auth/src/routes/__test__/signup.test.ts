import { app } from '../../app';
import request = require('supertest');


it('status 201 : successful Signup',  async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      name: "Test",
      email: 'test@test.com', 
      password: 'password'
    })
    .expect(201)
});

it('status 400 : Invalid Email',  async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      name: "Test",
      email: 'sfsfsdfs', 
      password: 'password'
    })
    .expect(400)
});

it('status 400 : Invalid passwrord',  async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      name: "Test",
      email: 'test@tst.com', 
      password: 'pas'
    })
    .expect(400)
});

it('status 400 : Missing Email and Password',  async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      name: "Test",
      email: '', 
      password: 'password'
    })
    .expect(400)

  await request(app)
    .post('/api/users/signup')
    .send({
      name: "Test",
      email: 'test@test.com', 
      password: ''
    })
    .expect(400)
});

it('status 400 : Email already exists',  async () => {

  await request(app)
    .post('/api/users/signup')
    .send({
      name: "Test",
      email: 'test@test.com', 
      password: 'password'
    })
    .expect(201)

  await request(app)
    .post('/api/users/signup')
    .send({
      name: "Test",
      email: 'test@test.com', 
      password: 'password'
    })
    .expect(400)
});

it('status 200 : sets cookies after successful signup', async () => {

  const res= await request(app)
  .post('/api/users/signup')
  .send({
    name: "Test",
    email: 'test@test.com', 
    password: 'password'
  })
  .expect(201);

  expect(res.get('Set-Cookie')).toBeDefined();
})