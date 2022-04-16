import { OrderStatus } from "@ticketary/sharedlibrary"
import mongoose from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { Order } from "../../models/order"
import { Ticket } from "../../models/ticket"

const createTicket = async () => {
    const ticket = Ticket.build({
        title: "abcd",
        price: 50
    })

    await ticket.save();

    return ticket;
}

it("status 401 : throw error when not signedIn (Unauthorized)", async () => {

    const orderId = new mongoose.Types.ObjectId();

    await request(app)
    .delete(`/api/orders/${orderId}`)
    .expect(401);

})


it("status 404 : order not found", async () => {

    const orderId = new mongoose.Types.ObjectId();

    await request(app)
    .delete(`/api/orders/${orderId}`)
    .set("Cookie",global.signin())
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
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .expect(401);

})


it("status 200 : order cancelled", async () => {

    const ticket = await createTicket();

    const user = global.signin();
    const {body: order} = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
        ticketId: ticket.id
    })
    .expect(201);

    await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie",user)
    .expect(204);

    const cancelledOrder = await Order.findById(order.id);

    expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);

})


it.todo("status 200 : emits order cancelled event ")