import { Container, Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <Container className="col-md-1 mx-auto">
      <Spinner animation="border" role="status" style={{ scale: "2px" }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );
};

export default Loader;
