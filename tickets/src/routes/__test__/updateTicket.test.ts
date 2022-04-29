import mongoose from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { connectNATS } from "../../connectNATS"
import { Ticket } from "../../models/ticket"


const createTicket = (title:string,price: number,signin: any) => {
    return request(app)
    .post('/api/tickets')
    .set('Cookie',signin)
    .send({
        title,
        price
    })
    .expect(201)
}

const check = async (title:string,price: number,id: mongoose.Types.ObjectId) => {
    const response = await request(app)
    .get(`/api/tickets/${id}`)
    .expect(200)

    expect(response.body.title).toEqual(title)
    expect(response.body.price).toEqual(price)
}

//if user try to update a ticket without logging in
it('status 401 : Unauthorized to edit ticket : Not Logged In',async () => {

    const id = new mongoose.Types.ObjectId().toHexString()

    await request(app)
    .put(`/api/tickets/${id}`)
    .send({
        title: 'pqrs',
        price: 12
    }).expect(401)
})


// if user try to update a ticket that doesnot exists
it('status 404 : ticket doesn\'t exists',async () => {

    const ticketId = new mongoose.Types.ObjectId().toHexString();

    const res = await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie",global.signin())
    .send({
        title: "asdf",
        price: 78
    }).expect(404)

})



// if user try to update a ticket that isnt his own
it('status 401 : Unauthorized to edit ticket : Owner Id doesn\'t match',async () => {

    let title = 'abcd',price=85;
    let signin = global.signin()
    const ticket = await createTicket(title,price,signin);

    await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie',global.signin())
    .send({
        title: 'asdf',
        price: 455
    })
    .expect(401)

    await check(title,price,ticket.body.id)
})



// if user try to update ticket with wrong attrs
it('status 400 : Wrong Attributes',async () => {

    let title = 'abcd',price=85;
    let signin = global.signin()
    const ticket = await createTicket(title,price,signin);

    await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", signin)
    .send({
        title: '',
        price: 455
    })
    .expect(400)

    await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", signin)
    .send({
        title: 'ddd',
        price: -10
    })
    .expect(400)


    await check(title,price,ticket.body.id)
})


// if user try to update ticket with everything right
it('status 200 : Successfully Updated',async () => {

    let title = 'abcd',price=85;
    let signin = global.signin()
    const ticket = await createTicket(title,price,signin);

    let newTitle = 'newTitle',newPrice=99;
    await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", signin)
    .send({
        title:newTitle,
        price:newPrice
    })
    .expect(200)



    await check(newTitle,newPrice,ticket.body.id)
})


it('status 200 : publish an event',async () => {

    let title = 'abcd',price=85;
    let signin = global.signin()
    const ticket = await createTicket(title,price,signin);

    let newTitle = 'newTitle',newPrice=99;
    await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", signin)
    .send({
        title:newTitle,
        price:newPrice
    })
    .expect(200)


    expect(connectNATS.client.publish).toHaveBeenCalled()
})

it('status 400 : failed to update locked ticket',async () => {

    let title = 'abcd',price=85;
    let signin = global.signin()
    const ticket = await createTicket(title,price,signin);

    const fetchTicket = await Ticket.findById(ticket.body.id);

    fetchTicket!.set({orderId: new mongoose.Types.ObjectId().toHexString()});

    await fetchTicket!.save();

    let newTitle = 'newTitle',newPrice=99;
    await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", signin)
    .send({
        title:newTitle,
        price:newPrice
    })
    .expect(400)

})