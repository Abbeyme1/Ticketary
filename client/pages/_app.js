import "bootstrap/dist/css/bootstrap.css";
import Header from "../Components/Header";
import handleClient from "../preBuild/handleClient";
import { Container } from "react-bootstrap";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Container>
        <Component currentUser={currentUser} {...pageProps} />
      </Container>
    </div>
  );
};

AppComponent.getInitialProps = async (ctx) => {
  const client = handleClient(ctx.ctx);
  const { data } = await client.get("/api/users/currentuser");
  let pageProps = {};
  if (ctx.Component.getInitialProps) {
    pageProps = await ctx.Component.getInitialProps(ctx.ctx, client, data);
  }
  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
