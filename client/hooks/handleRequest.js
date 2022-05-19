import { useState } from "react";
import axios from "axios";

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState([]);

  const sendRequest = async (props = {}) => {
    setErrors([]);
    try {
      const res = await axios[method](url, { ...body, ...props });

      if (onSuccess) onSuccess(res.data);

      return res.data;
    } catch (err) {
      setErrors(err.response.data.errors);
    }
  };

  return { sendRequest, errors };
};
