import React from "react";
import { Table, Nav } from "react-bootstrap";
import Link from "next/link";

const ShowOrders = ({ currentUser, orders }) => {
  const display = orders.map((order) => {
    return (
      <tr key={order.id}>
        <td>{order.id}</td>
        <td>{order.status}</td>
        <td>{order.ticket.id}</td>
        <td>{order.ticket.price}</td>
        <td>
          <Nav.Link as="div">
            <Link href={"/orders/[orderId]"} as={`/orders/${order.id}`}>
              View
            </Link>
          </Nav.Link>
        </td>
      </tr>
    );
  });

  return (
    <Table>
      <thead>
        <tr>
          <th>OrderId</th>
          <th>status</th>
          <th>TicketId</th>
          <th>Price</th>
          <th>View</th>
        </tr>
      </thead>

      <tbody>{display}</tbody>
    </Table>
  );
};

ShowOrders.getInitialProps = async (ctx, client, currentUser) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};
export default ShowOrders;
