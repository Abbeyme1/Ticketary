import { useState } from "react";
import handleError from "../../hooks/handleError";
import Router from "next/router";
import handleRequest from "../../hooks/handleRequest";
import { Button, Form, FormGroup, Spinner } from "react-bootstrap";
import Loader from "../../Components/Loader";

const createTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { sendRequest, errors } = handleRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
      description,
    },
    onSuccess: () => Router.push("/"),
  });

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    await sendRequest();
    setLoading(false);
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) return;

    setPrice(value.toFixed(2));
  };

  return (
    <>
      {loading && <Loader />}
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

        <FormGroup className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.length > 0 && handleError({ errors, field: "description" })}
        </FormGroup>

        {errors.length > 0 && handleError({ errors, field: "" })}

        <Button variant="danger" type="submit">
          Create Ticket
        </Button>
      </Form>
    </>
  );
};

export default createTicket;
