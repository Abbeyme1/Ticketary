import { Ticket } from "../ticket"



it('implements optimistic concurrency control', async () => {

    const ticket = Ticket.build({
        title: "abcd",
        price: 457,
        userId: "123"
    })

    await ticket.save();


    const firstInstance = await Ticket.findById(ticket.id);

    const secInstance = await Ticket.findById(ticket.id);


    firstInstance!.set({title: "pqrs"});

    secInstance!.set({title: "lmno"});


    await firstInstance!.save();

    try {
        await secInstance!.save();
    }
    catch(err) {
        return;
    }

    throw new Error("didn't worked as expected")
})

it('increments version number on every save', async () => {

    const ticket = Ticket.build({
        title: "abcd",
        price: 457,
        userId: "123"
    })

    await ticket.save();

    expect(ticket.version).toEqual(0);


    await ticket.save();

    expect(ticket.version).toEqual(1);
})