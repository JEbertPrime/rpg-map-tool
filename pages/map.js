import SvgBox from "../Components/SvgBox.jsx";
import {
  Input,
  Label,
  Col,
  Container,
  Row,
  TabContent,
  TabPane,
  Button,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import MapThumb from '../Components/MapThumb'
import classnames from "classnames";
import { useState, useContext } from "react";
import { SessionContext } from "../Components/Layout.jsx";

export default function Map() {
  var [radius, changeRadius] = useState(10);
  var [mapFile, changeMap] = useState({});
  var [mapURL, changeMapURL] = useState("");
  var [userMaps, changeUserMaps] = useState([]);
  var [mapTitle, changeMapTitle] = useState("");
  var session = useContext(SessionContext);
  const [activeTab, setActiveTab] = useState("1");
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const handleFile = (e) => {
    changeMap(e.target.files[0]);
    changeMapURL(window.URL.createObjectURL(e.target.files[0]));
  };
  const parseFileName = (fileName) => {
    var href = fileName.replace("public", "");
    return href.replaceAll("\\", "/");
  };
  const submitMap = () => {
    if (session) {
      window.URL.revokeObjectURL(mapURL);
      if (mapFile != {}) var data = new FormData();
      data.append("map", mapFile, mapFile.name);
      fetch("api/uploadMap", {
        method: "POST",
        body: data,
      })
        .then((response) => response.json())
        .then((obj) => {
          console.log(radius)
          let data = JSON.stringify({
            user: session.user.id,
            title: mapTitle,
            hexRadius: radius,
            fileName: parseFileName(obj.path),
          });
          fetch("api/maps/user/upload", {
            method: "POST",
            body: data,
          }).then(response=> response.status)
          .then(status=>{
            if(status === 201){
              getMyMaps()
            }
          });
          
          changeMapURL(parseFileName(obj.path));
        });
    } else {
      if (loading) {
        console.log(loading);
      } else {
        console.log("not logged in");
      }
    }
  };
  const getMyMaps = () => {
    if (session) {
      const data = JSON.stringify({
        user: session.user.id,
      });
      const maps = fetch("api/maps/all/user", {
        method: "POST",
        body: data,
      })
        .then((data) => data.json())
        .then((mapArray) => {
          changeUserMaps(mapArray);
        });
    }
  };
  const deleteThisMap = (id) =>{
    const data = JSON.stringify({
      mapId: id,
      user: session.user.id
    })
      fetch('api/maps/user/delete',{
        method: 'DELETE',
        body: data
      }).then((response)=> response.status)
      .then(status=>{
        if(status===200){
          getMyMaps()
        }
      })
  }
  const displayMap = (id) =>{
    const currentMap = userMaps.filter(userMap => userMap._id===id)[0]
    console.log(currentMap)
    changeMapURL(currentMap.fileName)
    changeRadius(currentMap.hexRadius)
  }
  
  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2}>
          <Row>
            <Col>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => {
                      toggle("1");
                    }}
                  >
                    Import
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => {
                      toggle("2");
                    }}
                  >
                    My Maps
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <h5>Hex Radius</h5>
                  <Input
                    type="range"
                    defaultValue={10}
                    onChange={(e) => changeRadius(+e.target.value)}
                    step={0.33}
                    max={40}
                    min={10}
                  />
                  <Input
                    type="text"
                    onChange={(e) => changeMapTitle(e.target.value)}
                    value={mapTitle}
                  />
                  <Input type="file" onChange={handleFile} />
                  <Button onClick={submitMap}>Submit</Button>
                </TabPane>
                <TabPane tabId="2">
                  <Button onClick={getMyMaps}>d</Button>
                  {userMaps.map((userMap) => {
                    return(
                    
                    <MapThumb
                      width={200}
                      height={200}
                      map={userMap}
                      id={userMap._id}
                      onClick={(e)=> {
                        displayMap(e.target.id)
                      }}
                    ><Button id={userMap._id} onClick={(e)=>{deleteThisMap(e.target.id)}} >Delete</Button></MapThumb>
                  )
                  })}
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        </Col>
        <Col md={9} lg={10}>
          <SvgBox radius={radius} width={700} url={mapURL} />
        </Col>
      </Row>
    </Container>
  );
}
