import mongoose from "mongoose";
import request from "supertest"
import { app } from "../../app"


it('status 404 : ticket not found',async () => {

    const id = new mongoose.Types.ObjectId().toHexString();
    const res = await request(app)
    .get(`/api/tickets/${id}`)
    .expect(404)
})


it('status 200 : ticket found', async () => {

    let title = 'rock n roll',price = 82,description ="Sgsdg";
    //login
    const res = await request(app)
    .post('/api/tickets')
    .set("Cookie", global.signin())
    .send({
        title,price,description
    })

    const {id} = res.body;

    const {body} = await request(app)
    .get(`/api/tickets/${id}`)
    .expect(200)

    expect(body.id).toEqual(id)
    expect(body.title).toEqual(title)
    expect(body.price).toEqual(price)
    expect(body.description).toEqual(description)
   
})