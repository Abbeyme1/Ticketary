import Router from "next/router";
import { useEffect } from "react";
import handleRequest from "../../hooks/handleRequest";

export default () => {
  const { sendRequest } = handleRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    sendRequest();
  }, []);

  return <h3>Signing out....</h3>;
};
