import React, { Component, useState, } from "react";
import {
  BsTypeBold,
  BsTypeItalic,
  BsTypeUnderline,
  BsCode,
  BsTypeH1,
  BsTypeH2,
  BsTypeH3,
  BsListUl,
  BsListOl
} from "react-icons/bs";
import styled from "styled-components";
import ColorPicker from './ColorPicker'
const Wrapper = styled.span`
      padding: 0px 2px 2px 2px;
      margin: 3px;
      ${(props) =>
        props.selected
          ? "border: 1px solid lightgrey; border-radius: .25rem;background-color: gainsboro;"
          : "border: 1px solid white;"}
    `;
    const ToolBarWrapper = styled.div`
        height: min-content;
        padding: 3px;
        border-bottom: 1px solid lightgrey;
    `
export const ToolBar = (props) => {
  var currentStyle, currentContentBlock
    if(props.editorState){
      var selectionState = props.editorState.getSelection();
      var anchorKey = selectionState.getAnchorKey();
      var currentContent = props.editorState.getCurrentContent();
       currentContentBlock = currentContent.getBlockForKey(anchorKey);
       currentStyle = props.editorState.getCurrentInlineStyle()
    }
 
  var [color, changeColor] = useState('#000')
  const handleColorChange = (color) =>{
      props.changeColor(color)
      changeColor(color)
  }
  return (
    <ToolBarWrapper>
      {toolbarItems.map((toolbarItem) => (
        <ToolbarButton
          key={toolbarItem.label}
          active={props.editorState ? 
            currentStyle.has(toolbarItem.style) ||
            currentContentBlock.getType() == toolbarItem.style : false
          }
          onToggle={props.onToggle}
          style={toolbarItem.style}
          icon={toolbarItem.icon}
          label={toolbarItem.label}
          type={toolbarItem.type}
        />
      ))}
      <ColorPicker color={color} onChangeColor={handleColorChange} />

    </ToolBarWrapper>
  );
};

class ToolbarButton extends Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style, this.props.type);
    };
  }

  render() {
    
    return (
      <Wrapper
        selected={this.props.active}
        onMouseDown={this.onToggle}
        id={this.props.label}
      >
        <this.props.icon />
      </Wrapper>
    );
  }
}

var toolbarItems = [
  { label: "Bold", style: "BOLD", icon: BsTypeBold, type: "inline" },
  { label: "Italic", style: "ITALIC", icon: BsTypeItalic, type: "inline" },
  {
    label: "Underline",
    style: "UNDERLINE",
    icon: BsTypeUnderline,
    type: "inline",
  },
  { label: "Heading 1", style: "header-one", icon: BsTypeH1, type: "block" },
  { label: "Heading 2", style: "header-two", icon: BsTypeH2, type: "block" },
  { label: "Heading 3", style: "header-three", icon: BsTypeH3, type: "block" },
  { label: "Unordered List", style: 'unordered-list-item', icon: BsListUl, type: 'block'},
  { label: "Ordered List", style: 'ordered-list-item', icon: BsListOl, type: 'block'},
];
