import { Form } from "react-bootstrap";

export default ({ errors, field }) => {
  return (
    <Form.Text className="text-muted">
      {errors
        .filter((err) => (field === null ? true : err.field === field))
        .map((err, i) => {
          return (
            <p key={i} style={{ color: "red" }}>
              {err.message}
            </p>
          );
        })}
    </Form.Text>
  );
};
