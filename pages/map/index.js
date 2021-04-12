import styled from "styled-components";
import styles from "../../styles/Map.module.css";
import SvgBox from "../../Components/SvgBox.jsx";
import HexMap from "./HexMap";
import { Editor, EditorState, convertFromRaw } from "draft-js";
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
import MapThumb from "../../Components/MapThumb";
import Toolbar from "../../Components/Toolbar";
import TextEditor from "../../Components/TextEditor";
import classnames from "classnames";
import {
  useState,
  useContext,
  useEffect,
  useReducer,
  createContext,
  memo,
} from "react";
import { SessionContext, HexContext } from "../../contexts/contexts.js";
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

///////////////////////////////////CONTEXTS/////////////////////////////////////////////
export default function Map() {
  /////////////////////MAP STATE //////////////////////
  var [mapFile, changeMap] = useState({});
  var [mapURL, changeMapURL] = useState("");
  var [userMaps, changeUserMaps] = useState([]);
  var [mapTitle, changeMapTitle] = useState("");
  var [radius, changeRadius] = useState(10);
  var [terrains, changeTerrains] = useState();
  var [colorLayer, changeColorLayer] = useState();
  var [texts, changeTexts] = useState();
  var [currentMap, changeCurrentMap] = useState();
  var [session] = useContext(SessionContext);

  //////////////////////////UI STATE///////////////////
  var [activeTab, setActiveTab] = useState("1");
  var [selectedTool, changeTool] = useState("0");
  var [cursor, changeCursor] = useState(null);
  var [color, changeColor] = useState("#fff");
  var [selectedColor, setSelectColor] = useState(false)
  var [selectedHexes, selectHex] = useState([]);
  var [selectType, changeSelectType] = useState("single");
  var [mouseDown, changeMouseDown] = useState(false);
  var [editorDisplay, toggleEditor] = useState("none");
  var [editorKey, changeEditorKey] = useState();
  var [text, changeTextState] = useState(EditorState.createEmpty());
  var [selectedTerrain, selectTerrain] = useState("desert");
var [change, stateChange] = useState(false)
  
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
      console.log(maps);
      return maps;
    }
    return maps;
  };
  const deleteThisMap = (map) => {
    map.delete();
  };
  const updateMap = (map) => {
    try{map.update()}catch(err){console.log(err)}
  };
  const displayMap = (id) => {
    var selectedMap = userMaps.find((userMap) => userMap._id === id)
    changeCurrentMap(selectedMap, console.log(currentMap));
    changeTerrains(selectedMap.terrains);
    changeColorLayer(selectedMap.colors, ()=>console.log(colorLayer));
    changeMapURL(selectedMap.file);
    changeRadius(selectedMap.radius);
  };
  const changeText = (text, key) => {
    if (currentMap) {
      currentMap.changeText(text, key)
      changeTextState(currentMap.getTextByKey(key))

    }
  };
  
  const handleHexEvent = (event, index) => {
    if (event.type == "mousedown") {
      changeMouseDown(true);
    } else if (event.type == "mouseup") {
      changeMouseDown(false);
    }
    if (selectedTool !== "text") {
      toggleEditor("none");
    }
    switch (selectedTool) {
      case "selectOne":
        if (event.type == "click") {
          changeSelectType("single");

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
      case "selectColor":
        //select by color
        if (event.type === "click") {
          var indices = []
          var selectColor = colorLayer.getColorByIndex(index)
          if(selectColor){

             indices = colorLayer.getColorLayer(selectColor).indices
             setSelectColor(selectColor)
             changeColorLayer(colorLayer.getColorLayer(selectColor))
             changeSelectType('color')
          }else if(colorLayer.parent){
            indices = colorLayer.parent.indices
            
            changeColorLayer(colorLayer.parent)
            
            changeSelectType('color')
            if(!colorLayer.parent.parent){
              changeSelectType('single', console.log(selectType))

            }
            setSelectColor(false)

          }else{
            indices = [...colorLayer.childIndices]
            changeSelectType('single')
          }

          selectHex(indices);
        }

        break;
      case "brush":
        if (mouseDown || event.type == "click") {
          if (
            (selectedHexes.length && selectedHexes.includes(index)) ||
            !selectedHexes.length
          ) {
            if (
              colorLayer.getColorByIndex(index) != color &&
              colorLayer.getColorByIndex(index)
            ) {
              colorLayer.changeChildColor(index, color);
              stateChange(!change)
            }
            if (colorLayer.getColorLayer(color)) {
              colorLayer.getColorLayer(color).addIndex(index);
              stateChange(!change)

            } else {
              colorLayer.addColor(color).addIndex(index);
              stateChange(!change)

            }
          }
        }
        break;
        case 'erase':
          if (mouseDown || event.type == "click") {
            if (
              (selectedHexes.length && selectedHexes.includes(index)) ||
              !selectedHexes.length
            ) {
              if (
                colorLayer.getColorByIndex(index)
              ) {
                colorLayer.getColorLayer(colorLayer.getColorByIndex(index)).removeIndex(index);
              }
             
            }
          }
          break
      case "text":
        if (event.type == "click") {

         var key = event.getModifierState('Shift') ? colorLayer.getColorByIndex(index) : index ? index : 0
          changeEditorKey(key)
          toggleEditor("block");
          var raw = currentMap.getTextByKey(key)
          raw ? raw.entityMap = {} : 
          console.log(raw)
          var content = raw ? convertFromRaw(raw) : false 
            changeTextState(content ? EditorState.createWithContent(content) : EditorState.createEmpty())
            changeEditorKey(key);
        }
        break;
      case "terrain":
        if (mouseDown || event.type == "click") {
          if (
            (selectedHexes.length && selectedHexes.includes(index)) ||
            !selectedHexes.length
          ) {
            if (currentMap.getTerrainByIndex(index) == selectedTerrain) {
              break;
            } else {
              currentMap.changeTerrain(index, selectedTerrain);
              changeTerrains(currentMap.terrains);
            }
          }
        }
        break;
    }
  };
  useEffect(async () => {
    var maps = await getMyMaps();
    changeUserMaps(maps.map((map) => new HexMap(map)));
  }, [session, userMaps.length]);
  useEffect(() => {
   var interval = setInterval(()=>updateMap(currentMap), 10000)
   return ()=>clearInterval(interval)
  }, [currentMap]);
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
                          id={userMap.id}
                          key={index}
                          onClick={(e) => {
                            displayMap(e.target.id);
                          }}
                        >
                          <Button
                            id={userMap.id}
                            onClick={(e) => {
                              deleteThisMap(userMap);
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
          <div style={{ display: editorDisplay }}>
            <TextEditor text={text} onChange={changeText} editing={editorKey} />
          </div>
          <SvgWrap cursor={cursor} onMouseLeave={() => changeMouseDown(false)}>
            <SvgBox
              selectType={selectType}
              colors={colorLayer}
              getTerrain={currentMap ? currentMap.getTerrainByIndex : false}
              radius={radius}
              width={700}
              url={mapURL}
              tool={selectedTool}
              onHexEvent={handleHexEvent}
              selectedHexes={selectedHexes}
            />
          </SvgWrap>
        </Col>

        <Toolbar
          onClick={changeTool}
          changeCursor={changeCursor}
          onTerrainChange={selectTerrain}
          terrain={selectedTerrain}
          selected={selectedTool}
          color={color}
          onChangeColor={changeColor}
        />
      </Row>
    </Container>
  );
}
