import axios from "axios";

export default ({ req }) => {
  // or we can use standard method of
  // servicename.namespacename.svc.cluster.local

  //ingress-nginx-controller.ingress-nginx.svc.cluster.local
  //http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser

  // console.log(ctx.req.cookies);

  if (typeof window === "undefined") {
    return axios.create({
      baseURL: "http://client-ext-srv",
      headers: req.headers,
    });
  } else {
    return axios.create();
  }
};
