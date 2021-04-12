import React, {useState} from 'react'
import styled from 'styled-components'
import {IconWrapper} from './index'

const Wrapper = styled.div`
    ${props => props.open ? 'display: block;' : 'display:none;'}
    position:absolute;
`
export default function ToolSelector (props) {
    var SelectedTool = props.icon
    var [isOpen, changeOpen] = useState(false)
    var openTimeout
    const toggleOpen = (bool = !isOpen) =>{
        changeOpen(bool)
    }
    const handleMouseDown = ( ) =>{
        openTimeout = setTimeout(toggleOpen, 400)
    }
    const handleMouseUp = () =>{
        clearTimeout(openTimeout)
    }
    return (
        <div onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={()=>toggleOpen(false)}>
            <SelectedTool  />
            <Wrapper open={isOpen} onClick={()=> toggleOpen(false)} >
            {props.children}

            </Wrapper>
        </div>
    )
}