// import Router from "next/router";
import Router from "next/router";
import handleError from "../../hooks/handleError";
import handleRequest from "../../hooks/handleRequest";

const ShowTicket = ({ currentUser, ticket }) => {
  const { sendRequest, errors } = handleRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  const buy = async () => {
    await sendRequest();
  };
  return (
    <div>
      <h1>Title: {ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      <button className="btn btn-primary" onClick={buy}>
        Buy
      </button>

      {errors && errors.length > 0 && handleError({ errors, field: "" })}
    </div>
  );
};

ShowTicket.getInitialProps = async (ctx, client, currentUser) => {
  const { ticketId } = ctx.query;

  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default ShowTicket;
