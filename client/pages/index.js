import handleClient from "../preBuild/handleClient";

const App = ({ currentUser }) => {
  return currentUser ? (
    <h1>you are signed in</h1>
  ) : (
    <h1>You are not Signed In</h1>
  );
};

App.getInitialProps = async (ctx) => {
  const client = handleClient(ctx);

  const { data } = await client.get("/api/users/currentuser");
  return data;
};

export default App;
