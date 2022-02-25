import request from 'supertest'
import { app } from '../../app'


it('status 200 : get current user info',async () => {
    
    const cookie = await global.signin();

    const res = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie',cookie)
    .send()
    .expect(200)

    expect(res.body.currentUser.email).toEqual('test@test.com')
})