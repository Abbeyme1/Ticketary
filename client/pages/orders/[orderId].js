import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import handeRequest from "../../hooks/handleRequest";
import Link from "next/link";
import Router from "next/router";
import { Container, Row, Col, Card, ListGroup, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Loader from "../../Components/Loader";

const ShowOrder = ({ currentUser, order }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [intervalId, setIntervalId] = useState();
  const { sendRequest, errors } = handeRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => {
      setLoading(false);
      Router.push("/orders");
    },
  });

  const setTime = () => {
    let ms = new Date(order.expiresAt) - new Date();
    setTimeLeft(Math.round(ms / 1000));
  };

  const handlePayment = async ({ id }) => {
    setLoading(true);
    clearInterval(intervalId);
    sendRequest({ token: id });
  };

  useEffect(() => {
    setTime();

    let id;
    id = setInterval(setTime, 1000);
    setIntervalId(id);

    if (timeLeft < 0) clearInterval(intervalId);

    return () => clearInterval(intervalId);
  }, []);

  const sendStatus = () => {
    if (order.status == "Complete") return <FontAwesomeIcon icon={faCheck} />;
    return <p>not found</p>;
  };
  return (
    <Container>
      {loading && <Loader />}
      <h3 key={order.id} className="pb-3" style={{ color: "grey" }}>
        ORDER ID: {order.id}{" "}
      </h3>
      <Row>
        <Col sm={8}>
          <ListGroup variant="flush">
            <ListGroup.Item className="pb-4">
              <h4>Payment Method</h4>
              <strong>Method: </strong>
              {"Stripe"}
            </ListGroup.Item>

            <ListGroup.Item className="pb-4">
              <h4>Status</h4>
              {timeLeft > 0 ? (
                <Row>
                  <Col>Time Left to Pay: {timeLeft} seconds</Col>
                </Row>
              ) : (
                <Row key={order.status}>
                  <Col>
                    <strong> Status: </strong>
                    {order.status}
                  </Col>
                </Row>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h4>Order Items</h4>

              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>
                      Title:{" "}
                      <Link
                        href={`/tickets/[ticketId]`}
                        as={`/tickets/${order.ticket.id}`}
                      >
                        {order.ticket.title}
                      </Link>
                    </Col>
                    <Col>Price: {order.ticket.price}</Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col sm={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>1</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>$0</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>
                    <Badge
                      pill
                      bg="success"
                      style={{
                        fontSize: "1.2rem",
                        color: "white",
                      }}
                    >
                      ${order.ticket.price}
                    </Badge>
                  </Col>
                </Row>
              </ListGroup.Item>
              <StripeCheckout
                email={currentUser.email}
                token={(token) => handlePayment(token)}
                stripeKey="pk_test_51KxVQuDkrD1Eq5UGNJ8zEz6HFkT5Aztsi8obybcmArlEV3gLcqoV58Zfm2xpiAiBKmxzv28laxVpYppnVf2bbG8D00eRrJg4WR"
                amount={order.ticket.price * 100}
                description={`order for ticketId: ${order.ticket.id}`}
                disabled={timeLeft <= 0 ? true : false}
              />
              <br></br>
            </ListGroup>
          </Card>

          {errors.length > 0 && handleError(errors)}

          {/* <Container>
            <h3>Total Price : ${order.ticket.price}</h3>
            <StripeCheckout
              email={currentUser.email}
              token={(token) => handlePayment(token)}
              stripeKey="pk_test_51KxVQuDkrD1Eq5UGNJ8zEz6HFkT5Aztsi8obybcmArlEV3gLcqoV58Zfm2xpiAiBKmxzv28laxVpYppnVf2bbG8D00eRrJg4WR"
              amount={order.ticket.price * 100}
              description={`order for ticketId: ${order.ticket.id}`}
              disabled={timeLeft <= 0 ? true : false}
            />
          </Container> */}
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
