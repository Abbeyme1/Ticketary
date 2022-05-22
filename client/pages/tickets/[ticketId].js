import { useState } from "react";
import Router from "next/router";
import handleError from "../../hooks/handleError";
import handleRequest from "../../hooks/handleRequest";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import Loader from "../../Components/Loader";

const ShowTicket = ({ currentUser, ticket }) => {
  const [loading, setLoading] = useState(false);
  const { sendRequest, errors } = handleRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => {
      setLoading(false);
      Router.push("/orders/[orderId]", `/orders/${order.id}`);
    },
  });

  const buy = async () => {
    setLoading(true);
    await sendRequest();
  };
  return (
    <Container>
      {loading && <Loader />}
      <Row>
        <Col sm={7}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Row>
                <Col>TicketId:</Col>
                <Col>
                  <strong>{ticket.id}</strong>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Title:</Col>
                <Col>
                  <strong style={{ fontFamily: "serif" }}>
                    {ticket.title}
                  </strong>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Price:</Col>
                <Col>
                  <strong style={{ fontFamily: "serif" }}>
                    ${ticket.price}
                  </strong>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <>
                <span style={{ fontWeight: "bold" }}>Description</span>:{" "}
                {ticket.description}
              </>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col sm={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${ticket.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Qty</Col>
                  <Col>
                    <Form.Control as="select">
                      {[...Array(1).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {!ticket.orderId ? (
                      <span style={{ color: "#4BB543", fontWeight: "bold" }}>
                        Available
                      </span>
                    ) : (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        Unavailable
                      </span>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  style={{
                    backgroundColor: "	#1E90FF",
                  }}
                  onClick={buy}
                  className="btn-block"
                  type="button"
                  disabled={ticket.orderId}
                >
                  Buy Ticket
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {errors && errors.length > 0 && handleError({ errors, field: "" })}
    </Container>
  );
};

ShowTicket.getInitialProps = async (ctx, client, currentUser) => {
  const { ticketId } = ctx.query;

  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default ShowTicket;
