import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Components/NavBar.jsx'
import {Container} from 'reactstrap'
function MyApp({ Component, pageProps }) {
  return (
    <Container fluid>
    <Navbar></Navbar>
  <Component {...pageProps} />
  </Container>
  )
}

export default MyApp
