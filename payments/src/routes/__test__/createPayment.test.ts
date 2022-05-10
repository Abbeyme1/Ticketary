import { OrderStatus } from "@ticketary/sharedlibrary"
import mongoose, { connect } from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { connectNATS } from "../../connectNATS"
import { Order } from "../../models/order"
import { Payment } from "../../models/payment"
import { stripe } from "../../stripe"



it("status 400 : invalid attrs",async () => {
    await request(app).post("/api/payments")
    .set("Cookie",global.signin()).
    send({
    }).expect(400)
})

it("status 404 : order doensn't exists",async () => {
    await request(app).post("/api/payments")
    .set("Cookie",global.signin()).
    send({
        orderId: new mongoose.Types.ObjectId().toHexString(),
        token: "tok_visa"
    }).expect(404)
})

it("status 401 : unauthorized user",async () => {

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 78
    })

    await order.save();


    await request(app).post("/api/payments")
    .set("Cookie",global.signin()).
    send({
        orderId: order.id,
        token: "tok_visa"
    }).expect(401)
})

it("status 400 : cannot pay for a order cancelled(BadRequest)",async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Cancelled,
        userId: userId,
        price: 799
    })

    await order.save();


    await request(app).post("/api/payments")
    .set("Cookie",global.signin(userId)).
    send({
        orderId: order.id,
        token: "tok_visa"
    }).expect(400)
})

it("crates payment",async () => {

    const price = Math.floor(Math.random() * 10000);

    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: userId,
        price
    })

    await order.save();


    await request(app).post("/api/payments")
    .set("Cookie",global.signin(userId)).
    send({
        orderId: order.id,
        token: "tok_visa"
    }).expect(201)


    const charges = await stripe.charges.list({limit: 50});

    const charge = charges.data.find((c) => {
        return c.amount === price * 100
    });

    expect(charge).toBeDefined();
    expect(charge?.currency).toEqual("usd");

    const payment = await Payment.findOne({
        orderId: order.id,
        paymentId: charge!.id
    });

    expect(payment).not.toBeNull();

    expect(connectNATS.client.publish).toHaveBeenCalled();


})