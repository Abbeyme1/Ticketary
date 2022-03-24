import request from "supertest"
import { app } from "../../app"

const createTicket = () => {
    return request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
        title: "abcd",
        price: 855
    })
    .expect(201)
}

it('status 200 : get list of tickets',async () => {

    await createTicket();
    await createTicket();

    const tickets = await request(app)
    .get('/api/tickets')
    .expect(200)

    expect(tickets.body.length).toEqual(2)

})