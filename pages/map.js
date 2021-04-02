import styled from "styled-components";

import SvgBox from "../Components/SvgBox.jsx";
import {
  Input,
  Label as unstyledLabel,
  FormGroup,
  Form,
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
import MapThumb from "../Components/MapThumb";
import Toolbar from "../Components/Toolbar";
import classnames from "classnames";
import {
  useState,
  useContext,
  useEffect,
  useReducer,
  createContext,
} from "react";
import { SessionContext, HexContext } from "../contexts/contexts.js";
import { dispatch } from "d3-dispatch";

////////////////STYLED COMPONENTS ///////////////////////////////
const FileInputLabel = styled(unstyledLabel)`
  width: 80%;
  height: 80px;
  border: 1px solid lightgrey;
  border-radius: 0.25rem;
  text-align: center;
  padding-top: 25px;
`;
const Label = styled(unstyledLabel)`
  width: 80%;
`;
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
const SvgWrap = styled.div`
  color: white;
  cursor: ${(props) =>
    props.cursor
      ? `url('svg/${props.cursor[0]}.svg') ${props.cursor[1]}, pointer `
      : "default"};
`;

////////////////////////////////////REDUCERS/STATE VALUES/////////////////////////////////
const hexInitialState = { hexes: [] };
function hexReducer(state, action) {
  switch (action.type) {
    case "ADD_HEX":
      var hexArray = [...state.hexes];
      hexArray[action.payload.index] = action.payload.hex;
      return { hexes: hexArray };
    case "CHANGE_HEX":
      var hexArray = [...state.hexes];
      var index = action.payload.index;
      hexArray[index] = action.payload.hex;
      return { hexes: hexArray };
    case "CHANGE_HEX_COLOR":
      var hexArray = [...state.hexes];
      var selectedHex = { ...hexArray[action.payload.index] };
      selectedHex.color = action.payload.color;
      hexArray[action.payload.index] = selectedHex;
      return { hexes: hexArray };
      case "RESET":
        return {hexes: action.payload.hexes}
    default:
      throw new Error();
  }
}
///////////////////////////////////CONTEXTS/////////////////////////////////////////////
export default function Map() {
  var [radius, changeRadius] = useState(10);
  var [mapFile, changeMap] = useState({});
  var [mapURL, changeMapURL] = useState("");
  var [userMaps, changeUserMaps] = useState([]);
  var [mapTitle, changeMapTitle] = useState("");
  var [session] = useContext(SessionContext);
  const [activeTab, setActiveTab] = useState("1");
  var [selectedTool, changeTool] = useState("0");
  var [cursor, changeCursor] = useState(null);
  var [color, changeColor] = useState("#fff");
  var [selectedHexes, selectHex] = useState([]);
  var [mouseDown, changeMouseDown] = useState(false);
  var [hexState, hexDispatch] = useReducer(hexReducer, hexInitialState);
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
          console.log(radius);
          let data = JSON.stringify({
            user: session.user.id,
            title: mapTitle,
            hexRadius: radius,
            fileName: parseFileName(obj.path),
          });
          fetch("api/maps/user/upload", {
            method: "POST",
            body: data,
          })
            .then((response) => response.status)
            .then((status) => {
              if (status === 201) {
                getMyMaps();
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
    var maps = [];
    console.log(session);
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
          return mapArray;
        });
      return maps;
    }
    return maps;
  };
  const deleteThisMap = (id) => {
    const data = JSON.stringify({
      mapId: id,
      user: session.user.id,
    });
    fetch("api/maps/user/delete", {
      method: "DELETE",
      body: data,
    })
      .then((response) => response.status)
      .then((status) => {
        if (status === 200) {
          getMyMaps();
        }
      });
  };
  const displayMap = (id) => {
    const currentMap = userMaps.filter((userMap) => userMap._id === id)[0];
    hexDispatch({type: 'RESET', payload: {hexes: []}})
    changeMapURL(currentMap.fileName);
    changeRadius(currentMap.hexRadius);
  };
  const handleHexEvent = (event, index) => {
    if (event.type == "mousedown") {
      changeMouseDown(true);
    } else if (event.type == "mouseup") {
      changeMouseDown(false);
    }

    switch (selectedTool) {
      case 0:
        if (event.type == "click") {
          if (event.getModifierState("Shift")) {
            var selectCopy = [...selectedHexes];
            selectCopy.push(index);
            selectHex(selectCopy);
          } else {
            if (selectedHexes.includes(index)) {
              var selectCopy = selectedHexes.filter(
                (value, i) => value != index
              );
              selectHex(selectCopy);
              break;
            } else {
              selectHex([index]);
            }
          }
        } else if (
          event.getModifierState("Shift") === true &&
          mouseDown &&
          !selectedHexes[index] &&
          event.type !== "click"
        ) {
          var selectCopy = [...selectedHexes];
          selectCopy.push(index);
          selectHex(selectCopy);
        }
        break;
      case 1:
        //select by color
        if( event.type === 'click' && hexState.hexes[index] && hexState.hexes[index].color){
          var hexes = [...hexState.hexes]
          var selectColor = hexes[index].color
          var selectedByColor = hexes.map((hex, i) => hex ? hex.color === selectColor ? i : undefined : undefined)
          
          selectHex(selectedByColor )
        }
        
        break;
      case 2:
        if (mouseDown || event.type == "click") {
          if (
            (selectedHexes.length && selectedHexes.includes(index)) ||
            !selectedHexes.length
          ) {
            if (hexState.hexes[index]) {
              if (hexState.hexes[index].color !== color) {
                hexDispatch({
                  type: "CHANGE_HEX_COLOR",
                  payload: { index: index, color: color },
                });
              }
            } else {
              hexDispatch({
                type: "ADD_HEX",
                payload: { index: index, hex: {} },
              });
              hexDispatch({
                type: "CHANGE_HEX_COLOR",
                payload: { index: index, color: color },
              });
            }
          }
        }
    }
  };
  useEffect(async () => {
    var maps = await getMyMaps();
    changeUserMaps(maps);
  }, [session, userMaps.length]);
  useEffect(()=>{

  }, [mapURL])
  return (
    <Container fluid>
      <Row noGutters>
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
                  <Form>
                    <Label>
                      Hex Radius
                      <Input
                        type="number"
                        step={0.1}
                        value={radius}
                        onChange={(e) => {
                          changeRadius(+e.target.value);
                        }}
                        max={40}
                        min={10}
                      />
                      <Input
                        value={radius}
                        type="range"
                        onChange={(e) => changeRadius(+e.target.value)}
                        step={1}
                        max={40}
                        min={10}
                      />
                    </Label>
                    <FormGroup>
                      <Label>
                        Map Title
                        <Input
                          type="text"
                          onChange={(e) => changeMapTitle(e.target.value)}
                          value={mapTitle}
                        />
                      </Label>
                    </FormGroup>

                    <FileInputLabel>
                      <Input
                        type="file"
                        onChange={handleFile}
                        style={{ display: "none" }}
                      />
                      <strong>Drag</strong> map or select file
                    </FileInputLabel>
                    <FormGroup>
                      <Button onClick={submitMap}>Submit</Button>
                    </FormGroup>
                  </Form>
                </TabPane>
                <TabPane tabId="2">
                  <MapWrap cursor={cursor}>
                    {userMaps.map((userMap, index) => {
                      return (
                        <MapThumb
                          width={200}
                          height={200}
                          map={userMap}
                          id={userMap._id}
                          key={index}
                          onClick={(e) => {
                            displayMap(e.target.id);
                          }}
                        >
                          <Button
                            id={userMap._id}
                            onClick={(e) => {
                              deleteThisMap(e.target.id);
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
        <Col>
          <SvgWrap cursor={cursor}>
            <HexContext.Provider value={hexDispatch}>
              <SvgBox
                hexes={hexState.hexes}
                radius={radius}
                width={700}
                url={mapURL}
                tool={selectedTool}
                onHexEvent={handleHexEvent}
                selectedHexes={selectedHexes}
              />
            </HexContext.Provider>
          </SvgWrap>
        </Col>

        <Toolbar
          onClick={changeTool}
          changeCursor={changeCursor}
          selected={selectedTool}
          color={color}
          onChangeColor={changeColor}
        />
      </Row>
    </Container>
  );
}
