import styled from "styled-components";
import styles from "../../styles/Map.module.css";
import SvgBox from "../../Components/SvgBox.jsx";
import HexMap from "../../Classes/HexMap";
import SideBar from "../../Components/map/SideBar";
import { useRouter } from "next/router";
import { EditorState, convertFromRaw } from "draft-js";
import {Col, Container, Row } from "reactstrap";
import Toolbar from "../../Components/Toolbar";
import TextEditor from "../../Components/TextEditor";
import {
  useState,
  useContext,
  useEffect,
  
} from "react";
import { SessionContext } from "../../contexts/contexts.js";

////////////////STYLED COMPONENTS ///////////////////////////////

const PanelToggle = styled.button`
  background-color: white;
  border: none;
  border-left: 1px solid lightgrey;
  &:hover {
    background-color: lightgrey;
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
  const router = useRouter();
  const { map_id, isPublic } = router.query;
  var [publicMap, changePublicMap] = useState(isPublic);
  /////////////////////MAP STATE //////////////////////
  var [mapURL, changeMapURL] = useState("");
  var [userMaps, changeUserMaps] = useState([]);
  var [mapsLoaded, changeMapsLoaded] = useState(false);
  var [radius, changeRadius] = useState(10);
  var [colorLayer, changeColorLayer] = useState();
  var [currentMap, changeCurrentMap] = useState();
  var [session] = useContext(SessionContext);

  //////////////////////////UI STATE///////////////////
  var [activeTab, setActiveTab] = useState("1");
  var [sideOpen, setSideOpen] = useState(true);
  var [selectedTool, changeTool] = useState("0");
  var [cursor, changeCursor] = useState(null);
  var [color, changeColor] = useState("#fff");
  var [selectedHexes, selectHex] = useState([]);
  var [selectType, changeSelectType] = useState("single");
  var [mouseDown, changeMouseDown] = useState(false);
  var [editorDisplay, toggleEditor] = useState("none");
  var [editorKey, changeEditorKey] = useState();
  var [text, changeTextState] = useState(EditorState.createEmpty());
  var [selectedTerrain, selectTerrain] = useState("desert");
  var [change, stateChange] = useState(false);
  var [errorMessage, setError] = useState(false);
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const toggleSidePanel = () => setSideOpen(!sideOpen);
  const handleSubmitMap = (path) => {
    if (path) {
      getMyMaps().then((maps) =>
        changeUserMaps(maps.map((map) => new HexMap(map)))
      );}
      toggle("2");
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

  const updateMap = (map) => {
    try {
      map.update();
    } catch (err) {
      console.log(err);
    }
  };
  const displayMap = (id) => {
    changePublicMap(false);
    var selectedMap = userMaps.find((userMap) => userMap._id === id);
    if (selectedMap) {
      changeCurrentMap(selectedMap);
      changeColorLayer(selectedMap.colors);
      changeMapURL(selectedMap.file);
      changeRadius(selectedMap.radius);
    }
  };
  const displayPublicMap = async (id) => {
    var publicMapData = await fetch("api/maps/public/" + id, {
      method: "GET",
    }).then((data) => data.json());
    var selectedMap = new HexMap(publicMapData[0]);
    console.log(selectedMap);
    if (selectedMap) {
      changeCurrentMap(selectedMap);
      changeColorLayer(selectedMap.colors);
      changeMapURL(selectedMap.file);
      changeRadius(selectedMap.radius);
    }
  };
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

  const handleHexEvent = (event, index) => {
    if (currentMap) {
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
            (event.type == "mousedown" || event.type == "mouseenter")
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
              changeColorLayer(colorLayer.getColorLayer(selectColor));
              changeSelectType("color");
            } else if (colorLayer.parent) {
              indices = colorLayer.parent.indices;

              changeColorLayer(colorLayer.parent);

              changeSelectType("color");
              if (!colorLayer.parent.parent) {
                changeSelectType("single", console.log(selectType));
              }
            } else {
              indices = [...colorLayer.childIndices];
              changeSelectType("single");
            }

            selectHex(indices);
          }

          break;
        case "brush":
          if (
            (mouseDown && event.type == "mouseenter") ||
            event.type == "click" ||
            event.type == "mousedown"
          ) {
            console.log(event.type);
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
            console.log(colorLayer.toJson());
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
              }
            }
          }
          break;
      }
    } else {
      setError({ message: "A map must be loaded before you can edit hexes." });
    }
  };
  useEffect(async () => {
    var maps = await getMyMaps();
    changeUserMaps(maps.map((map) => new HexMap(map)));
    changeMapsLoaded(true);
  }, [session, userMaps.length]);

  useEffect(() => {
    if (map_id && mapsLoaded) {
      toggleSidePanel(false);

      publicMap == "true" ? displayPublicMap(map_id) : displayMap(map_id);
    }
  }, [map_id, mapsLoaded]);
  useEffect(() => {
    if (publicMap != "true") {
      var interval = setInterval(() => updateMap(currentMap), 10000);
      return () => clearInterval(interval);
    }
  }, [currentMap]);
  return (
    <Container fluid style={{ paddingLeft: "0px" }}>
      <Row noGutters>
        <SideBar
          changeMapURL={changeMapURL}
          sideOpen={sideOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          radius={radius}
          changeRadius={changeRadius}
          userMaps={userMaps}
          displayMap={displayMap}
          handleSubmitMap={handleSubmitMap}
          changeUserMaps={changeUserMaps}
        />

        <PanelToggle onClick={toggleSidePanel}>
          {" "}
          {sideOpen ? "<<" : ">>"}{" "}
        </PanelToggle>
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
