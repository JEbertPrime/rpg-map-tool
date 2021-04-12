import {
  BsBrush,
  BsCursorText,
  BsCursor,
  BsCursorFill,
  BsArrowsMove,
} from "react-icons/bs";
import {
  BiEraser
}from "react-icons/bi"
import {
  GiForest,
  GiMountainCave,
  GiDesert,
  GiSnowflake2,
  GiSandCastle,
  GiGrass,
  GiSwamp,
  GiDeathSkull,
} from "react-icons/gi";
import { CompactPicker } from "react-color";
import ToolSelector from "./ToolSelector";
import styled from "styled-components";
import { useState, createRef } from "react";
const ColorPickerWrap = styled.div`
  background-color: none;
  width: fit-content;
`;
const ColorSwatch = styled.div`
  width: 32px;
  height: 32px;
  border: 1px solid grey;
  border-radius: 0.15rem;
  background-color: ${(props) => props.color};
`;
const RightWrap = styled.div`
  right: 100%;
  position: relative;
`;
const cursors = [
  ["cursor", "24 0"],
  ["cursor-fill", "24 0"],
  ["brush-fill", "0 24"],
  ["eraser", '6 18'],
  ["cursor-text", "12 12"],
  ["arrows-move", "12 12"],
];
const icons = [
  { icon: BsCursor, tool: "selectOne" },
  { icon: BsCursorFill, tool: "selectColor" },
  { icon: BsBrush, tool: "brush" },
  {icon: BiEraser, tool:'erase'},
  { icon: BsCursorText, tool: "text" },
  { icon: BsArrowsMove, tool: "pan" },
];

export const IconWrapper = styled.div``;
export const StyledMainIcons = icons.map((icon) => {
  let styledIcon = styled(icon.icon)`
    &:hover {
      background-color: grey;
    }
    ${(props) =>
      props.selected
        ? "border:1px solid grey;background-color: lightgrey;"
        : "border:1px solid white"};
    border-radius: 0.15rem;
    height: 32px;
    width: 32px;
  `;
  return { icon: styledIcon, tool: icon.tool };
});
const TerrainIcons = [
  { icon: GiForest, terrain: "forest", tool:'terrain' },
  { icon: GiMountainCave, terrain: "mountain", tool:'terrain' },
  { icon: GiDesert, terrain: "desert", tool:'terrain' },
  { icon: GiSnowflake2, terrain: "arctic", tool:'terrain' },
  { icon: GiSandCastle, terrain: "coast", tool:'terrain' },
  { icon: GiGrass, terrain: "grassland", tool:'terrain' },
  { icon: GiSwamp, terrain: "wetland", tool:'terrain' },
  { icon: GiDeathSkull, terrain: "underdark", tool:'terrain' },
];
export const StyledTerrainIcons = TerrainIcons.map((icon) => {
  let styledIcon = styled(icon.icon)`
    &:hover {
      background-color: grey;
    }
    ${(props) =>
      props.selected
        ? "border:1px solid grey;background-color: lightgrey;"
        : "border:1px solid white"};
    border-radius: 0.15rem;
    height: 32px;
    width: 32px;
  `;
  return { icon: styledIcon, terrain: icon.terrain, tool: icon.tool };
});
const IconStyleWrapper = styled.div`
  ${ColorPickerWrap} {
    display: ${(props) => (props.pickerOpen ? "block" : "none")};
  }
  width: 24px;
  margin-right: 15px;
`;

export default function Toolbar(props) {
  var [open, setOpen] = useState(false);
  var [selectedTerrain, selectTerrain] = [props.terrain, props.onTerrainChange];
  const toggleOpen = (bool= !open) => {
    setOpen(bool);
  };
  var [color, changeColor] = [props.color, props.onChangeColor];
  return (
    <IconStyleWrapper pickerOpen={open}>
      {StyledMainIcons.map((icon, index) => {
        let Icon = icon.icon;
        return (
          <IconWrapper>
            <Icon
              selected={icon.tool === props.selected}
              onClick={() => {
                props.onClick(icon.tool);
                props.changeCursor(cursors[index]);
              }}
              id={icon.tool}
              key={index}
            />
          </IconWrapper>
        );
      })}
      <ToolSelector icon={()=>{
        var {icon, terrain,tool} = StyledTerrainIcons.find((ico) => ico.terrain === selectedTerrain)
        
        var Icon = icon
        return <Icon  selected={props.selected == tool}
              onClick={() => {
                selectTerrain(terrain)
                props.onClick(tool)
                props.changeCursor(cursors[2]);
              }}
              id={terrain}
              />
      }}>
      {StyledTerrainIcons.map((icon, index) => {
        let Icon = icon.icon;
        return (
          <IconWrapper>
            <Icon
              selected={icon.terrain === selectedTerrain}
              onClick={() => {
                console.log(icon.tool)
                selectTerrain(icon.terrain)
                props.onClick(icon.tool)
                props.changeCursor(cursors[2]);
              }}
              id={icon.terrain}
              key={index}
            />
          </IconWrapper>
        );
      })}
      </ToolSelector>
      <ColorSwatch color={color} open={open} onClick={toggleOpen}  onBlur={()=>toggleOpen(false)}>
        <ColorPickerWrap style={{display: open ? 'block': 'none'}}>
          <RightWrap>
            <CompactPicker
              style={{ right: "100%" }}
              color={color}
              onChangeComplete={(color) => {
                changeColor(color.hex);
                toggleOpen();
              }}
            />
          </RightWrap>
        </ColorPickerWrap>
      </ColorSwatch>
    </IconStyleWrapper>
  );
}
