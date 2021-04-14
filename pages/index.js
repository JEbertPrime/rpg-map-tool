import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import HexMap from '../Classes/HexMap'
import SvgBox from "../Components/SvgBox.jsx";
import styled from 'styled-components'


import { Input, Label, Col, Container , Row } from "reactstrap";
import MapShowcase from '../Components/MapShowcase.jsx'
import { SessionContext } from "../contexts/contexts.js";
const StyledCol = styled(Col)`
  background-color: white;
  border-radius: 15px;
  box-shadow: 0px 3px 6px grey;
  height: 100%;
  padding: 10px;
  margin-top: 25px
`
const StyledContainer = styled(Container)`
`
const Background = styled.div`
  position: fixed;
  background-color:#FFD6D6;
  height: 100vh;
  width: 100vw

`
const devMaps = [{title: 'Example 1', fileName: 'maps/example_1.jpg', _id:1}, {title: 'Example 2', fileName: 'maps/example_2.jpg', _id:2}]



export default function Home(props) {
  const [session, error] = props.session ? props.session : useContext(SessionContext)
  const [userMaps, changeUserMaps] = useState([])
  const [publicMaps, changePublicMaps] = useState([])


  const getMyMaps = async () => {
    var error = null, maps = []
    if (session) {
      
      const data = JSON.stringify({
        user: session.user.id,
      });
       maps = fetch("api/maps/all/user", {
        method: "POST",
        body: data,
      })
        .then((data) => data.json())
        .then((mapArray) => {
          return mapArray
        })
        .catch((err)=>{
          return err
        });
        
        
    }
    return maps
  };
  const getPublicMaps = async () => {
    var maps = []
    maps = fetch('api/maps/public', {
      method: 'GET'
    })
    .then(data=> data.json())
    return maps
  }
  
  useEffect(async ()=>{
    var maps = await getMyMaps()
    var pMaps = await getPublicMaps()
    changeUserMaps(maps.map(map=>new HexMap(map)))
    changePublicMaps(pMaps.map(map=> new HexMap(map)))
    
  }, [session])
  return (
    <main >
    <Background/>
  <StyledContainer fluid>
    <Row>
    <Col md={2} lg={3}/>
      <StyledCol md={8} lg={6}>
        <MapShowcase maps={publicMaps} linked publicMap>
          <h1>Public Maps</h1>
        </MapShowcase>
        <MapShowcase maps={userMaps} linked={true}>
          <h1>My Maps</h1>
        </MapShowcase>
      </StyledCol>
      <Col md={2} lg={3} />
    </Row>
  </StyledContainer>
  </main>
  )
  ;
}
