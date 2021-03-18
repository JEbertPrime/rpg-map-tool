import Head from 'next/head'
import styles from '../styles/Home.module.css'
import SvgBox from '../Components/SvgBox.jsx' 
import {Input, Label, Col, Container, Row, TabContent, TabPane, Button, Nav, NavItem, NavLink} from 'reactstrap'
import classnames from 'classnames';
import {  useSession } from 'next-auth/client'

import { useState } from 'react'
export default function Map() {
  var [radius, changeRadius] = useState(10)
  var [mapFile, changeMap] = useState({})
  var [mapURL, changeMapURL] = useState('')
  var [session, loading] = useSession()
    const [activeTab, setActiveTab] = useState('1');
    const toggle = tab => {
      if(activeTab !== tab) setActiveTab(tab);
    }
  const handleFile =(e) =>{
    
    changeMap(e.target.files[0])
    changeMapURL(window.URL.createObjectURL(e.target.files[0]))

    
  }
  const submitFile = () =>{
    window.URL.revokeObjectURL(mapURL);
    if(mapFile!={})
    var data = new FormData()
    data.append('map',
                mapFile,
                mapFile.name)
    fetch('api/uploadMap', {
      method:'POST',
      body: data
    }).then(response => response.json())
    .then(obj =>{
      let data = JSON.stringify({
        user: session.id,
        title: 'poop',
        fileName: obj.path
      })
      fetch('api/maps/upload',{
        method:'POST',
        body:data
      });
      var href = obj.path.replace('public', '')
       changeMapURL(href.replaceAll('\\', '/'))
      })
      
  }
  const getMyMaps = () =>{
    console.log(session)
    const data = JSON.stringify({
      user: session.user.id
    })
    const maps = fetch('api/maps/all/user', {
      method:'POST',
      body: data
    }).then(data => data.json())
    console.log(maps)
  }
  return (
    <Container >
      <Row>
      <Col md={3}>
        <Row>      
        <Col>
            <Nav tabs>
              <NavItem>
              <NavLink className={classnames({ active: activeTab === '1' })}
            onClick={() => { toggle('1'); }}>Import</NavLink>
                
              </NavItem>
              <NavItem>
              <NavLink className={classnames({ active: activeTab === '2' })}
            onClick={() => { toggle('2'); }}>My Maps</NavLink>
                
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Input type='range' defaultValue={10} onChange={(e)=>changeRadius(+e.target.value)} step={.33}max={40} min={10}/>
              <Input type='file' onChange={handleFile}/>
              <Button onClick={submitFile}>Submit</Button>
              </TabPane>
              <TabPane tabId='2'>
                <Button onClick={getMyMaps}>d</Button>
              </TabPane>
            </TabContent>
          
        </Col>
      </Row>
      </Col>
      <Col>
        <SvgBox radius={radius} width={700} url={mapURL}/>
      </Col>
      </Row>
      
      
    </Container>
  )
}
