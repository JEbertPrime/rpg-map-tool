import { CompactPicker } from "react-color";
import styled from "styled-components";
import {useState} from 'react'
import {BsType} from 'react-icons/bs'
const ColorPickerWrap = styled.div`
    ${props => props.open ? 'display: block;' : 'display: none;'}
  background-color: none;
  width: fit-content
`
const Wrapper = styled.span`
  padding: 0px 2px 2px 2px;
      margin: 0px 3px 0px 3px;
      position: fixed

`
const ColorSwatch = styled(BsType)`
  width: 16px;
  height: 16px;
  color: ${props=> props.color}
`
const RightWrap = styled.div`
top: 24px;
  position:absolute;
`
export default function ColorPicker (props) {
    var [color, changeColor] = [props.color,props.onChangeColor]
    var [open, changeOpen] = useState(false)
    const toggleOpen = () =>{
        changeOpen(!open)
    }
    return (
        <Wrapper >
                <ColorSwatch color={color} open={open} onClick={toggleOpen} />

            <ColorPickerWrap open={open}>
      <RightWrap>
        <CompactPicker style={{right: '100%'}}  color={color} onChangeComplete={(color)=>{
          changeColor(color.hex)
      toggleOpen()}}/>
      </RightWrap>
      </ColorPickerWrap>
        </Wrapper>
      
      
    )
}