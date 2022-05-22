import { Row, Col, Card, Image } from "react-bootstrap";
import Link from "next/link";

const App = ({ currentUser, tickets }) => {
  const display = tickets.map((ticket) => {
    return (
      <Col key={ticket.id} sm={4} className="pb-4">
        <Card style={{ width: "18rem" }} bg={ticket.orderId ? "light" : "info"}>
          <Card.Body>
            <Card.Title>{ticket.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              ${ticket.price}
            </Card.Subtitle>
            <Card.Text>
              {ticket.description.length > 30
                ? ticket.description.slice(0, 30) + " ..."
                : ticket.description}
            </Card.Text>

            <Card.Link style={{ paddingRight: "10px" }}>
              <Link
                href={"/tickets/edit/[ticketId]"}
                as={`/tickets/edit/${ticket.id}`}
                disabled={true}
              >
                {!currentUser ||
                ticket.userId !== currentUser.id ||
                ticket.orderId ? (
                  <a style={{ pointerEvents: "none" }}>Edit</a>
                ) : (
                  <a>Edit</a>
                )}
              </Link>
            </Card.Link>

            <Card.Link disabled={true}>
              <Link href={"/tickets/[ticketId]"} as={`/tickets/${ticket.id}`}>
                <a disabled={true}>View</a>
              </Link>
            </Card.Link>
          </Card.Body>
        </Card>
      </Col>
    );
  });

  return (
    <Row>
      {tickets.length > 0 ? (
        display
      ) : (
        <Row>
          <Image src="https://cdn.dribbble.com/users/1135689/screenshots/3957784/media/179c3827aa24a4908b5c20505c9076be.png?compress=1&resize=800x600&vertical=top"></Image>
        </Row>
      )}
    </Row>
  );
};

App.getInitialProps = async (ctx, client, currentUser) => {
  const { data } = await client.get("/api/tickets");

  return { tickets: data };
};

export default App;
