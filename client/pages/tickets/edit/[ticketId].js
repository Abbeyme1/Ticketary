import { useState } from "react";
import Router from "next/router";
import { Button, Form, FormGroup } from "react-bootstrap";
import handleRequest from "../../../hooks/handleRequest";
import handleError from "../../../hooks/handleError";

const EditTicket = ({ ticket }) => {
  const [title, setTitle] = useState(ticket.title);
  const [price, setPrice] = useState(ticket.price);
  const { sendRequest, errors } = handleRequest({
    url: `/api/tickets/${ticket.id}`,
    method: "put",
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push("/"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) return;

    setPrice(value.toFixed(2));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.length > 0 && handleError({ errors, field: "title" })}
      </FormGroup>
      <FormGroup className="mb-3">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="text"
          placeholder="Price"
          value={price}
          onBlur={onBlur}
          onChange={(e) => setPrice(e.target.value)}
        />
        {errors.length > 0 && handleError({ errors, field: "price" })}
      </FormGroup>

      {errors.length > 0 && handleError({ errors, field: "" })}

      <Button variant="danger" type="submit">
        Update Ticket
      </Button>
    </Form>
  );
};

EditTicket.getInitialProps = async (ctx, client, currentUser) => {
  const { ticketId } = ctx.query;

  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};
export default EditTicket;
