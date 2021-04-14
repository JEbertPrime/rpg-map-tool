import styled from "styled-components";
import styles from "../../styles/Map.module.css";
import SvgBox from "../../Components/SvgBox.jsx";
import MapUpload from "../../Components/MapUpload";
import HexMap from "../../Classes/HexMap";
import generateUUID from '../../utils/uuid'
import { useRouter } from 'next/router'
import { EditorState, convertFromRaw } from "draft-js";
import {
  Label as unstyledLabel,
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
import { SessionContext } from "../../contexts/contexts.js";

////////////////STYLED COMPONENTS ///////////////////////////////

const PanelToggle = styled.button`
  background-color:white;
  border: none;
  border-left: 1px solid lightgrey;
  &:hover{
    background-color: lightgrey;
  }
`
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
  /////////////////////Router stuff ///////////////////
  const router = useRouter()
  const { map_id, isPublic } = router.query
  var [publicMap, changePublicMap] = useState(isPublic)
  /////////////////////MAP STATE //////////////////////
  var [mapFile, changeMap] = useState({});
  var [mapURL, changeMapURL] = useState("");
  var [userMaps, changeUserMaps] = useState([]);
  var [mapsLoaded, changeMapsLoaded] = useState(false)
  var [mapTitle, changeMapTitle] = useState("");
  var [radius, changeRadius] = useState(10);
  var [terrains, changeTerrains] = useState();
  var [colorLayer, changeColorLayer] = useState();
  var [currentMap, changeCurrentMap] = useState();
  var [session] = useContext(SessionContext);

  //////////////////////////UI STATE///////////////////
  var [activeTab, setActiveTab] = useState("1");
  var [sideOpen, setSideOpen] = useState(true)
  var [selectedTool, changeTool] = useState("0");
  var [cursor, changeCursor] = useState(null);
  var [color, changeColor] = useState("#fff");
  var [selectedColor, setSelectColor] = useState(false);
  var [selectedHexes, selectHex] = useState([]);
  var [selectType, changeSelectType] = useState("single");
  var [mouseDown, changeMouseDown] = useState(false);
  var [editorDisplay, toggleEditor] = useState("none");
  var [editorKey, changeEditorKey] = useState();
  var [text, changeTextState] = useState(EditorState.createEmpty());
  var [selectedTerrain, selectTerrain] = useState("desert");
  var [change, stateChange] = useState(false);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const toggleSidePanel = () => setSideOpen(!sideOpen)
 
  const handleFile = (e) => {
    var blob = e.target.files[0];
    var type = blob.type;
    var uniqueName = "map" + generateUUID() + "." + type.split("/").pop();
    var newFile = new File([blob], uniqueName, { type: type });

    changeMap(newFile);
    changeMapURL(window.URL.createObjectURL(newFile));
    return newFile.name;
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
  const updateMap = (map) => {
    try {
      map.update();
    } catch (err) {
      console.log(err);
    }
  };
  const displayMap = (id) => {
    changePublicMap(false)
    var selectedMap = userMaps.find((userMap) => userMap._id === id);
    if(selectedMap){
      changeCurrentMap(selectedMap);
    changeTerrains(selectedMap.terrains);
    changeColorLayer(selectedMap.colors);
    changeMapURL(selectedMap.file);
    changeRadius(selectedMap.radius);
    }
    
  };
  const displayPublicMap = async (id) => {
    var publicMapData = await fetch('api/maps/public/' + id,{
      method: 'GET'
    }).then(data=>data.json())
    var selectedMap = new HexMap(publicMapData[0])
    console.log(selectedMap)
    if(selectedMap){
      changeCurrentMap(selectedMap);
    changeTerrains(selectedMap.terrains);
    changeColorLayer(selectedMap.colors);
    changeMapURL(selectedMap.file);
    changeRadius(selectedMap.radius);
    }
  }
  const changeText = (text, key) => {
    if (colorLayer) {
      colorLayer.changeText(text, key);
      changeTextState(
        EditorState.createWithContent(
          convertFromRaw(colorLayer.getTextByKey(key))
        )
      );
    }
  };
  const handleSubmitMap = (path) => {
    if (path) {
      console.log(path)
       getMyMaps().then((maps) =>
        changeUserMaps(maps.map((map) => new HexMap(map)))
      );
      toggle("2")
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
      changeEditorKey("trash");
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
          var indices = [];
          var selectColor = colorLayer.getColorByIndex(index);
          if (selectColor) {
            indices = colorLayer.getColorLayer(selectColor).indices;
            setSelectColor(selectColor);
            changeColorLayer(colorLayer.getColorLayer(selectColor));
            changeSelectType("color");
          } else if (colorLayer.parent) {
            indices = colorLayer.parent.indices;

            changeColorLayer(colorLayer.parent);

            changeSelectType("color");
            if (!colorLayer.parent.parent) {
              changeSelectType("single", console.log(selectType));
            }
            setSelectColor(false);
          } else {
            indices = [...colorLayer.childIndices];
            changeSelectType("single");
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
              stateChange(!change);
            }
            if (colorLayer.getColorLayer(color)) {
              colorLayer.getColorLayer(color).addIndex(index);
              stateChange(!change);
            } else {
              colorLayer.addColor(color).addIndex(index);
              stateChange(!change);
            }
          }
        }
        break;
      case "erase":
        if (mouseDown || event.type == "click") {
          if (
            (selectedHexes.length && selectedHexes.includes(index)) ||
            !selectedHexes.length
          ) {
            if (colorLayer.getColorByIndex(index)) {
              colorLayer
                .getColorLayer(colorLayer.getColorByIndex(index))
                .removeIndex(index);
            }
          }
        }
        break;
      case "text":
        if (event.type == "click") {
          var key = event.getModifierState("Shift")
            ? colorLayer.getColorByIndex(index)
            : index
            ? index
            : 0;

          changeEditorKey(key);
          toggleEditor("block");
          var raw = colorLayer.getTextByKey(key);
          raw ? (raw.entityMap = {}) : false;
          var content = raw ? convertFromRaw(raw) : false;
          changeTextState(
            content
              ? EditorState.createWithContent(content)
              : EditorState.createEmpty()
          );
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
    changeMapsLoaded(true)

  }, [session, userMaps.length]);

  useEffect( ()=>{
    if(map_id && mapsLoaded){
      toggleSidePanel(false)

      publicMap =='true'? displayPublicMap(map_id) : displayMap(map_id)
    }
  }, [map_id, mapsLoaded])
  useEffect(() => {
    if(publicMap!= 'true'){
    var interval = setInterval(() => updateMap(currentMap), 10000);
    return () => clearInterval(interval);
    }
  }, [currentMap]);
  return (
    <Container fluid style={{paddingLeft: '0px'}}>
      <Row noGutters>
        <Col md={3} lg={2} style={{display: sideOpen ? 'block': 'none', paddingLeft: '15px'}}>
          <Row styled={{marginRight: '0px', marginLeft: '15px'}}>
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
        <PanelToggle onClick={toggleSidePanel}> {sideOpen ? '<<' : '>>'} </PanelToggle>
        <Col>
          <div style={{ display: editorDisplay }}>
            <TextEditor
              text={text}
              onChange={changeText}
              editing={editorKey}
              change={true}
            />
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
