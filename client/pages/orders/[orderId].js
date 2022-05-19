import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import handeRequest from "../../hooks/handleRequest";
import Router from "next/router";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const ShowOrder = ({ currentUser, order }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { sendRequest, errors } = handeRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => {
      Router.push("/orders");
    },
  });

  const setTime = () => {
    let ms = new Date(order.expiresAt) - new Date();
    setTimeLeft(Math.round(ms / 1000));
  };

  const handlePayment = async ({ id }) => {
    sendRequest({ token: id });
  };

  useEffect(() => {
    setTime();

    let intervalId;
    intervalId = setInterval(setTime, 1000);

    if (timeLeft < 0) clearInterval(intervalId);

    return () => clearInterval(intervalId);
  }, []);

  const sendStatus = () => {
    console.log("yes");
    if (order.status == "Complete") return <FontAwesomeIcon icon={faCheck} />;
    return <p>not found</p>;
  };
  return (
    <Container>
      <Row>
        <Col sm={8}>
          <h3 key={order.id}>ORDER ID: {order.id}</h3>
          {timeLeft > 0 ? (
            <p>Time Left to Pay: {timeLeft} seconds</p>
          ) : (
            <p key={order.status}>Status: {order.status}</p>
          )}
          <br></br>
          <Row>
            <Col>Title: {order.ticket.title}</Col>
            <Col>Price: {order.ticket.price}</Col>
          </Row>
        </Col>
        <Col sm={4}>
          <Container>
            <h3>Total Price : ${order.ticket.price}</h3>
            <StripeCheckout
              email={currentUser.email}
              token={(token) => handlePayment(token)}
              stripeKey="pk_test_51KxVQuDkrD1Eq5UGNJ8zEz6HFkT5Aztsi8obybcmArlEV3gLcqoV58Zfm2xpiAiBKmxzv28laxVpYppnVf2bbG8D00eRrJg4WR"
              amount={order.ticket.price * 100}
              description={`order for ticketId: ${order.ticket.id}`}
              disabled={order.status === "Complete" ? true : false}
            />
          </Container>
        </Col>
      </Row>

      {errors.length > 0 && handleError(errors)}
    </Container>
  );
};

ShowOrder.getInitialProps = async (ctx, client, currentUser) => {
  const { orderId } = ctx.query;

  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default ShowOrder;
