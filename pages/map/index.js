import styled from "styled-components";
import styles from "../../styles/Map.module.css";
import SvgBox from "../../Components/SvgBox.jsx";
import MapUpload from '../../Components/MapUpload'
import HexMap from "../../Classes/HexMap";
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
  function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
       return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid; };
  const handleFile = (e) => {
    var blob = e.target.files[0]
    var type = blob.type
    var uniqueName = 'map' + generateUUID() + '.' + type.split('/').pop()
    var newFile = new File([blob], uniqueName, {type: type} )
    
    changeMap(newFile);
    changeMapURL(window.URL.createObjectURL(newFile));
    return newFile.name
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
   var deleted =  map.delete();
   if(deleted){
     var mapsCopy = [...userMaps]
      mapsCopy.splice(index, 1)
    changeUserMaps(mapsCopy)
    return true
   }else{
     return false
   }
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
    if (colorLayer) {
      colorLayer.changeText(text, key)
      changeTextState(EditorState.createWithContent(convertFromRaw(colorLayer.getTextByKey(key))))

    }
  };
  const handleSubmitMap = (path) =>{
    if(path){
      changeMapURL(path)
      getMyMaps.then((maps)=> changeUserMaps(maps.map((map) => new HexMap(map))))
    }
  }
  const handleHexEvent = (event, index) => {
    if (event.type == "mousedown") {
      changeMouseDown(true);
    } else if (event.type == "mouseup") {
      changeMouseDown(false);
    }
    if (selectedTool !== "text") {
      toggleEditor("none");
      changeEditorKey('trash')
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
          var raw = colorLayer.getTextByKey(key)
          raw ? raw.entityMap = {} : false
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
                  <MapUpload onRadius={changeRadius} onFile={handleFile} onTitle={changeMapTitle} onSubmitMap={handleSubmitMap} radius={radius} mapTitle={mapTitle} file={mapFile} />
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
        <Col>
          <div style={{ display: editorDisplay }}>
            <TextEditor text={text} onChange={changeText} editing={editorKey} change={true} />
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
