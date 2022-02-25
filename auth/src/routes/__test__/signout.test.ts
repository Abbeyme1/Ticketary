import request from 'supertest';
import { app } from '../../app';


it('status 200 : successful signout',async () => {

    await request(app)
    .post('/api/users/signup')
    .send({
      name: "Test",
      email: 'test@test.com', 
      password: 'password'
    })
    .expect(201)

    const res = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);
    
    // expect(res.get('Set-Cookie')[0].split(';')[0]).toEqual('session=')

    expect(res.get('Set-Cookie')[0])
    .toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly')
})