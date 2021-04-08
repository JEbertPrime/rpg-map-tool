import { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic'
import {Rnd as Wrapper} from "react-rnd";

import styled from 'styled-components'
const DragHandle = styled.div`
    width: 100%;
    background-color: lightgrey;
    border: 1px solid lightgrey;
    height: min-content;
    text-align:center;
    cursor:default;
    display: flex;
`
const SaveMessage = styled.p`
    color: lightgrey;
    position: absolute;
    right: 0px;
`
const StyledDiv = styled.div`
    width: 500px;
    height: max-content;
    min-height: 50px;
    background-color: white;
    border: 1px solid lightgrey;
    
`

import {Editor, EditorState} from 'draft-js'
import React, {Component} from 'react'
export default class TextEditor extends Component {
  constructor(props){
    super(props)
    this.state = {
      editorState: EditorState.createEmpty()
    }
  }
  render (){
    return (
    <Wrapper dragHandleClassName={'drag-handle'}>
      <StyledDiv>
    <Editor editorState={this.state.editorState} onChange={(e)=>{
      this.setState({editorState: e})
    }}/>
    </StyledDiv>
    <DragHandle className='drag-handle' >...</DragHandle>
    </Wrapper>
    
    )
  }
}
// Custom overrides for each style
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 4,
  },
  BOLD: {
    color: '#395296',
    fontWeight: 'bold',
  },
  ANYCUSTOMSTYLE: {
    color: '#00e400',
  },
}

class ToolbarButton extends Component {
  constructor() {
    super()
    this.onToggle = (e) => {
      e.preventDefault()
      this.props.onToggle(this.props.style)
    }
  }

  render() {
    const buttonStyle = {
      padding: 10,
    }
    return (
      <span onMouseDown={this.onToggle} style={buttonStyle}>
        {this.props.label}
      </span>
    )
  }
}

var toolbarItems = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Code', style: 'CODE' },
  { label: 'Surprise', style: 'ANYCUSTOMSTYLE' },
]

const ToolBar = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle()
  return (
    <div>
      {toolbarItems.map((toolbarItem) => (
        <ToolbarButton
          key={toolbarItem.label}
          active={currentStyle.has(toolbarItem.style)}
          label={toolbarItem.label}
          onToggle={props.onToggle}
          style={toolbarItem.style}
        />
      ))}
    </div>
  )
}

