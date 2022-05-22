import mongoose from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { connectNATS } from "../../connectNATS"
import { Ticket } from "../../models/ticket"


const createTicket = (title:string,price: number,description: string,signin: any) => {
    return request(app)
    .post('/api/tickets')
    .set('Cookie',signin)
    .send({
        title,
        price,
        description
    })
    .expect(201)
}

const check = async (title:string,price: number,description: string,id: mongoose.Types.ObjectId) => {
    const response = await request(app)
    .get(`/api/tickets/${id}`)
    .expect(200)

    expect(response.body.title).toEqual(title)
    expect(response.body.price).toEqual(price)
    expect(response.body.description).toEqual(description)
}

//if user try to update a ticket without logging in
it('status 401 : Unauthorized to edit ticket : Not Logged In',async () => {

    const id = new mongoose.Types.ObjectId().toHexString()

    await request(app)
    .put(`/api/tickets/${id}`)
    .send({
        title: 'pqrs',
        price: 12,
        description: "d"
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
        price: 78,
        description: "d"
    }).expect(404)

})



// if user try to update a ticket that isnt his own
it('status 401 : Unauthorized to edit ticket : Owner Id doesn\'t match',async () => {

    let title = 'abcd',price=85,description= "d";
    let signin = global.signin();
    const ticket = await createTicket(title,price,description,signin);

    await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie',global.signin())
    .send({
        title: 'asdf',
        price: 455,
        description: "D"
    })
    .expect(401)

    await check(title,price,description,ticket.body.id)
})



// if user try to update ticket with wrong attrs
it('status 400 : Wrong Attributes',async () => {

    let title = 'abcd',price=85,description= "d";
    let signin = global.signin()
    const ticket = await createTicket(title,price,description,signin);

    await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", signin)
    .send({
        title: '',
        price: 455,
        description: "d"
    })
    .expect(400)

    await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", signin)
    .send({
        title: 'ddd',
        price: -10,
        description: "d"
    })
    .expect(400)

    await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", signin)
    .send({
        title: 'ddd',
        price: 40,
        description: ""
    })
    .expect(400)


    await check(title,price,description,ticket.body.id)
})


// if user try to update ticket with everything right
it('status 200 : Successfully Updated',async () => {

    let title = 'abcd',price=85,description= "d";
    let signin = global.signin()
    const ticket = await createTicket(title,price,description,signin);

    let newTitle = 'newTitle',newPrice=99,newDesc="d";
    await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", signin)
    .send({
        title:newTitle,
        price:newPrice,
        description: newDesc
    })
    .expect(200)



    await check(newTitle,newPrice,newDesc,ticket.body.id)
})


it('status 200 : publish an event',async () => {

    let title = 'abcd',price=85,description= "d";;
    let signin = global.signin()
    const ticket = await createTicket(title,price,description,signin);

    let newTitle = 'newTitle',newPrice=99,newDesc = "SDF";
    await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", signin)
    .send({
        title:newTitle,
        price:newPrice,
        description: newDesc
    })
    .expect(200)


    expect(connectNATS.client.publish).toHaveBeenCalled()
})

it('status 400 : failed to update locked ticket',async () => {

    let title = 'abcd',price=85,description= "d";;
    let signin = global.signin()
    const ticket = await createTicket(title,price,description,signin);

    const fetchTicket = await Ticket.findById(ticket.body.id);

    fetchTicket!.set({orderId: new mongoose.Types.ObjectId().toHexString()});

    await fetchTicket!.save();

    let newTitle = 'newTitle',newPrice=99,newDesc="SDf";
    await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", signin)
    .send({
        title:newTitle,
        price:newPrice,
        description:newDesc
    })
    .expect(400)

})