import request from 'supertest';
import { app } from '../../app';
import {Ticket} from "../../models/ticket"
import {connectNATS} from "../../connectNATS"

it('status !400 : listening to /api/tickets',async () => {
    const res = await request(app)
    .post('/api/tickets').send({
    })

    expect(res.status).not.toEqual(404)
})

it('status 401 : throw error when not signedIn (Unauthorized)',async () => {
    
    await request(app)
        .post('/api/tickets')
        .send({
            title: "sdf",
            price: 50,
            description: "sd"
        })
        .expect(401)
})

it('status 201 : accessible to signedIn users only',async () => {

    await request(app)
        .post('/api/tickets')
        .set("Cookie",global.signin())
        .send({
            title: "BORN TO SHINE",
            price: 50,
            description: "sfd"
        })
        .expect(201)
})

it('status 400 : invalid title',async () => {
    await request(app)
    .post('/api/tickets')
    .set("Cookie",global.signin())
    .send({
        title: "",
        price: 45,
        description: "sfd"
    })
    .expect(400);
})

it('status 400 : invalid price',async () => {
    await request(app)
    .post('/api/tickets')
    .set("Cookie",global.signin())
    .send({
        title: "Born to shine concert",
        price: -8,
        description: "sfd"
    })
    .expect(400);
})

it('status 400 : invalid description',async () => {
    await request(app)
    .post('/api/tickets')
    .set("Cookie",global.signin())
    .send({
        title: "Born to shine concert",
        price: -8,
        description: ""
    })
    .expect(400);
})


it('status 200 : successfully created ticket',async () => {

    let tickets = await Ticket.find({});

    expect(tickets.length).toEqual(0) 

    let title = "BORN TO SHINE",price = 50,description ="Sgsdg";

    await request(app)
        .post('/api/tickets')
        .set("Cookie",global.signin())
        .send({
            title,price,description
        })
        .expect(201)

    tickets = await Ticket.find({});

    expect(tickets.length).toEqual(1)
    expect(tickets[0].title).toEqual(title)
    expect(tickets[0].price).toEqual(price)
    expect(tickets[0].description).toEqual(description)


})

it('status 200 : publish an event',async () => {

    let tickets = await Ticket.find({});

    let title = "BORN TO SHINE",price = 50,description ="Sgsdg";

    await request(app)
        .post('/api/tickets')
        .set("Cookie",global.signin())
        .send({
            title,price,description
        })
        .expect(201)

    
    expect(connectNATS.client.publish).toHaveBeenCalled();
})