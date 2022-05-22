import { useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import {
  Button,
  Form,
  FormControl,
  FormGroup,
  InputGroup,
  Spinner,
} from "react-bootstrap";

import handleRequest from "../hooks/handleRequest";
import handleError from "../hooks/handleError";
import Router from "next/router";

import Loader from "./Loader";

export default ({ type }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const body = {
    email,
    password,
  };
  let url = "/api/users/" + type;

  if (type === "signup") body.name = name;

  const { sendRequest, errors } = handleRequest({
    url,
    method: "post",
    body,
    onSuccess: () => Router.push("/"),
  });

  library.add(faEye, faEyeSlash);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    await sendRequest();
    setLoading(false);
  };

  const toggleShowPass = () => {
    setShowPass(!showPass);
  };

  return (
    <>
      {loading && <Loader />}
      <Form onSubmit={handleSubmit}>
        {type === "signup" && (
          <FormGroup className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
            {errors.length > 0 && handleError({ errors, field: "name" })}
          </FormGroup>
        )}

        <FormGroup className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.length > 0 && handleError({ errors, field: "email" })}
        </FormGroup>
        <FormGroup className="mb-3">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <FormControl
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <InputGroup.Text>
              <FontAwesomeIcon
                icon={showPass ? faEyeSlash : faEye}
                onClick={toggleShowPass}
              />
            </InputGroup.Text>
          </InputGroup>
          {errors.length > 0 && handleError({ errors, field: "password" })}
        </FormGroup>

        {errors.length > 0 && handleError({ errors, field: "" })}

        <Button variant="danger" type="submit">
          {type}
        </Button>
      </Form>
    </>
  );
};
