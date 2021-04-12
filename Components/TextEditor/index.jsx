import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import equal from 'deep-equal'
import { Rnd as Wrapper } from "react-rnd";
import { ToolBar } from "./Toolbar";
import styled from "styled-components";
import { Editor, EditorState, RichUtils, ContentState, convertToRaw } from "draft-js";
import React, { Component } from "react";
import createStyles from 'draft-js-custom-styles';


const DragHandle = styled.div`
  width: 100%;
  background-color: lightgrey;
  border: 1px solid lightgrey;
  height: min-content;
  text-align: center;
  cursor: default;
  display: flex;
`;
const SaveMessage = styled.p`
  color: lightgrey;
  position: absolute;
  right: 0px;
`;
const StyledDiv = styled.div`
  width: 500px;
  height: max-content;
  min-height: 50px;
  background-color: white;
  border: 1px solid lightgrey;
`;

const { styles, customStyleFn, exporter } = createStyles(['font-size', 'color', 'text-transform'], 'CUSTOM_');


export default class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = { editorState: props.text ? props.text : EditorState.createEmpty() };
    this.onChange = (editorState) => {this.setState({ editorState })};
    this.saveText = props.onChange
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    
  }

  handleCustomStyles = (style) =>{
    switch(style){
      case 'COLOR':
        return {backgroundColor: '#00e400'}
        default:
          return { color: 'white'}
    }
  }
  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChange(newState);
      return "handled";
    }

    return "not-handled";
  }
  onToggle = (style, type) => {
    
    this.onChange(type == 'inline' ? RichUtils.toggleInlineStyle(this.state.editorState, style) : RichUtils.toggleBlockType(this.state.editorState, style) );
  };
  toggleColor = (color) => {
    const newEditorState = styles.color.toggle(this.state.editorState, color);
 
    return this.onChange(newEditorState);
  };
  componentDidMount(){
    if(this.props.text){
      this.onChange(this.props.text)
    }
    this.interval = setInterval( ()=>{
      this.props.onChange(convertToRaw(this.state.editorState.getCurrentContent()), this.props.editing)
    } , 2000)
  }
  componentDidUpdate(prevProps, prevState){

    if(prevProps.editing != this.props.editing){
      this.onChange(this.props.text)
      clearInterval(this.interval)
      this.interval = setInterval( ()=>{
        this.props.onChange(convertToRaw(this.state.editorState.getCurrentContent()), this.props.editing)
      } , 2000)

    }
  }
  componentWillUnmount(){
    clearInterval(this.interval)
  }
  render() {
    return (
      <Wrapper dragHandleClassName={"drag-handle"}>
        <StyledDiv>
          <ToolBar
            onToggle={this.onToggle}
            editorState={this.props.editing == 0 ? false : this.state.editorState}
            changeColor={this.toggleColor}
          />
          <Editor
          customStyleFn={customStyleFn}
            userSelect="none"
            contentEditable={false}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
          />
        </StyledDiv>
        <DragHandle className="drag-handle">...</DragHandle>
      </Wrapper>
    );
  }
}
// Custom overrides for each style
const styleMap = {
  'CODE': {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 4,
  },
  'BOLD': {
    fontWeight: "bold",
  },
  'H1': {
    fontSize: "2.5rem",
    marginBottom: ".5rem",
    fontFamily: "inherit",
    fontWeight: 500,
    lineHeight: 1.2,
    color: "inherit",
  }
  
};
