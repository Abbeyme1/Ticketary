import mongoose from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { connectNATS } from "../../connectNATS"
import { Order,OrderStatus } from "../../models/order"
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

    const ticket = await createTicket();

    await request(app)
    .post("/api/orders")
    .send({
        ticketId: ticket.id
    })
    .expect(401);

})

it("status 400 : invalid ticketId", async () => {

    await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
        ticketId: "ashdsfjsofsfk"
    })
    .expect(400);

})


it("status 404 : ticket doesn't exists",async () => {
    
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ticketId})
    .expect(404);
})


it("status 404 : ticket is already reserved",async () => {
    const ticket = await createTicket();

    const order = Order.build({
        userId: "abcd",
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket
    })

    await order.save();

    await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
        ticketId: ticket.id
    })
    .expect(400);
})

it("status 201 : order created ",async () => {
    const ticket = await createTicket();

    await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
        ticketId: ticket.id
    })
    .expect(201);
})

it("status 200 : emits order created event ",async () => {

    const ticket = await createTicket();

    await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
        ticketId: ticket.id
    })
    .expect(201);

    expect(connectNATS.client.publish).toHaveBeenCalled();

})