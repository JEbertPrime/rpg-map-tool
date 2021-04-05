import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container as cont } from "reactstrap";
import styled from "styled-components";
import Layout from "../Components/Layout";
const Container = styled(cont)`
  padding: 0px 0px 0px 0px;
`;
function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
