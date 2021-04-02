import {
  BsBrush,
  BsCursorText,
  BsCursor,
  BsCursorFill,
  BsArrowsMove,
} from "react-icons/bs";
import { CompactPicker } from "react-color";

import styled from "styled-components";
import { useState, createRef } from "react";
const ColorPickerWrap = styled.div`
  background-color: none;
  width: fit-content
`
const ColorSwatch = styled.div`
  
  width: 32px;
  height: 32px;
  border: 1px solid grey;
  border-radius: .15rem;
  background-color: ${props=> props.color}
`
const RightWrap = styled.div`
  right: 100%;
  position:relative;
`
const cursors = [
  ["cursor", '24 0'],
  ["cursor-fill", '24 0'],
  ["brush-fill", '0 24'],
  ["cursor-text", '12 12'],
  ["arrows-move", '12 12'],
];
const icons = [BsCursor, BsCursorFill, BsBrush, BsCursorText, BsArrowsMove];
const styledIcons = icons.map(
  (icon) => styled(icon)`
    &:hover {
      background-color: grey;
    }
    ${(props) =>
      props.selected ? "border:1px solid grey;background-color: lightgrey;" : "border:1px solid white"};
      border-radius: .15rem;
    height: 32px;
    width: 32px;
  `
);
const IconStyleWrapper = styled.div`
${ColorPickerWrap}{
    display: ${props => props.pickerOpen ? 'block' : 'none'};
    }
  width: 24px;
  margin-right: 15px;
`;

export default function Toolbar(props) {
  var [open, setOpen] = useState(false)
  const toggleOpen = () => {
    setOpen(!open)
  }
  var [color, changeColor] = [props.color,props.onChangeColor]
  return (
    <IconStyleWrapper pickerOpen={open}>
      {styledIcons.map((Icon, index) => (
        <Icon
          selected={index === props.selected}
          onClick={() => {
            props.onClick(index);
            props.changeCursor(cursors[index]);
          }}
          id={index}
          key={index}
        />
      ))}
      <ColorSwatch color={color} open={open} onClick={toggleOpen} >
      <ColorPickerWrap>
      <RightWrap>
        <CompactPicker style={{right: '100%'}}  color={color} onChangeComplete={(color)=>{
          changeColor(color.hex)
      toggleOpen()}}/>
      </RightWrap>
      </ColorPickerWrap>
      </ColorSwatch>
      
      
    </IconStyleWrapper>
  );
}
