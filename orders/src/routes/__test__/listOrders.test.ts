import request from "supertest"
import { app } from "../../app"
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

    const ticket = await createTicket();

    await request(app)
    .get("/api/orders")
    .expect(401);

})


it("status 200 : get all orders of a user", async () => {

    const ticket1 = await createTicket();
    const ticket2 = await createTicket();
    const ticket3 = await createTicket();

    const user1 = global.signin();
    const user2 = global.signin();

    const {body: order1} = await request(app)
    .post("/api/orders")
    .set("Cookie",user1)
    .send({
        ticketId: ticket1.id
    }).expect(201)

    const {body: order2} = await request(app)
    .post("/api/orders")
    .set("Cookie",user1)
    .send({
        ticketId: ticket2.id
    }).expect(201)

    await request(app)
    .post("/api/orders")
    .set("Cookie",user2)
    .send({
        ticketId: ticket3.id
    }).expect(201)

    const {body: orders} = await request(app)
    .get("/api/orders")
    .set("Cookie",user1)
    .expect(200)

    expect(orders.length).toEqual(2);
    expect(orders[0].id).toEqual(order1.id)
    expect(orders[1].id).toEqual(order2.id)
    expect(orders[0].ticket.id).toEqual(ticket1.id)
    expect(orders[1].ticket.id).toEqual(ticket2.id)

})