import mongoose from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { Ticket } from "../../models/ticket"

const createTicket = async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "abcd",
        price: 50
    })

    await ticket.save();

    return ticket;
}


it("status 401 : throw error when not signedIn (Unauthorized)", async () => {

    await request(app)
    .get(`/api/orders/abcd`)
    .expect(401);

})


it("status 404 : order doesn't exists",async () => {
    
    const orderId = new mongoose.Types.ObjectId();

    await request(app)
    .get(`/api/orders/${orderId}`)
    .set("Cookie", global.signin())
    .expect(404);
})

it("status 404 : order doesn't belong to user",async () => {
    
    const ticket = await createTicket();
    const user = global.signin();

    const {body: order} = await request(app)
    .post("/api/orders")
    .set("Cookie",user)
    .send({
        ticketId: ticket.id
    }).expect(201)


    await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .expect(401);

})


it("status 200 : fetches order",async () => {
    
    const ticket = await createTicket();
    const user = global.signin();

    const {body: order} = await request(app)
    .post("/api/orders")
    .set("Cookie",user)
    .send({
        ticketId: ticket.id
    }).expect(201)


    const {body: fetchedOrder} = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(200);

    expect(fetchedOrder.id).toEqual(order.id)


})