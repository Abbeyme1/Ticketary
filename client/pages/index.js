import { Table, Nav } from "react-bootstrap";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const App = ({ currentUser, tickets }) => {
  const display = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Nav.Link as="div">
            <Link
              href={"/tickets/edit/[ticketId]"}
              as={`/tickets/edit/${ticket.id}`}
            >
              <a>
                <FontAwesomeIcon icon={faPen} />
              </a>
            </Link>
          </Nav.Link>
        </td>
        <td>
          <Nav.Link as="div">
            <Link href={"/tickets/[ticketId]"} as={`/tickets/${ticket.id}`}>
              <a>View</a>
            </Link>
          </Nav.Link>
        </td>
      </tr>
    );
  });

  // console.log(tickets);
  return (
    <Table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Edit</th>
          <th>View</th>
        </tr>
      </thead>

      <tbody>{display}</tbody>
    </Table>
  );
};

App.getInitialProps = async (ctx, client, currentUser) => {
  const { data } = await client.get("/api/tickets");

  return { tickets: data };
};

export default App;
