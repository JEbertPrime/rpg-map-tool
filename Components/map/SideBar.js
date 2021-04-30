import MapUpload from "./MapUpload";
import MapThumb from "../MapThumb";
import classnames from "classnames";
import generateUUID from "../../utils/uuid";

import { useState } from "react";
import {
  Col,
  Row,
  Nav,
  TabPane,
  NavItem,
  NavLink,
  TabContent,
  Button,
} from "reactstrap";
import styled from "styled-components";
const MapWrap = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 600px;
  &::-webkit-scrollbar {
    width: 3px;
    height: 10px;
    background-color: white;
  }
  &::-webkit-scrollbar-thumb {
    background: lightgrey;
  }
`;
export default function SideBar({
  sideOpen,
  changeMapURL,
  activeTab,
  setActiveTab,
  radius,
  changeRadius,
  userMaps,
  displayMap,
  handleSubmitMap,
  changeUserMaps,
}) {
  var [mapTitle, changeMapTitle] = useState("");
  var [mapFile, changeMapFile] = useState(false);
 
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const handleFile = (e) => {
    var blob = e.target.files[0];
    var type = blob.type;
    var uniqueName = "map" + generateUUID() + "." + type.split("/").pop();
    var newFile = new File([blob], uniqueName, { type: type });

    changeMapFile(newFile);
    changeMapURL(window.URL.createObjectURL(newFile));
    return newFile.name;
  };
  const deleteThisMap = (map, index) => {
    var deleted = map.delete();
    if (deleted) {
      var mapsCopy = [...userMaps];
      mapsCopy.splice(index, 1);
      changeUserMaps(mapsCopy);
      return true;
    } else {
      return false;
    }
  };

  return (
    <Col
      md={3}
      lg={2}
      style={{ display: sideOpen ? "block" : "none", paddingLeft: "15px" }}
    >
      <Row styled={{ marginRight: "0px", marginLeft: "15px" }}>
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
              <MapUpload
                onRadius={changeRadius}
                onFile={handleFile}
                onTitle={changeMapTitle}
                onSubmitMap={handleSubmitMap}
                radius={radius}
                mapTitle={mapTitle}
                file={mapFile}
              />
            </TabPane>
            <TabPane tabId="2">
              <MapWrap>
                {userMaps.map((userMap, index) => {
                  return (
                    <MapThumb
                      width={200}
                      height={200}
                      map={userMap}
                      id={userMap.id}
                      key={index}
                      onClick={(e) => {
                        displayMap(e.target.id);
                      }}
                    >
                      <Button
                        id={userMap.id}
                        onClick={(e) => {
                          deleteThisMap(userMap, index);
                        }}
                      >
                        Delete
                      </Button>
                    </MapThumb>
                  );
                })}
              </MapWrap>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </Col>
  );
}
