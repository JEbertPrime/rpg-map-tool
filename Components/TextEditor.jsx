import { useState, useEffect, useRef } from "react";
import {Rnd as Wrapper} from "react-rnd";
import Editor from "react-rte";
import styled from 'styled-components'
const DragHandle = styled.div`
    width: 100%;
    background-color: white;
    border: 1px solid lightgrey;
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
    width: max-content;
    height: max-content;
    
`
function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }
export default function TextEditor(props) {
  var [text, changeText] = [props.text, props.onChange]
  var [textCache, changeCache] = useState(text)
    var [saved, changeSaved] = useState(false)
    const changeTextCache = (text) =>{
        changeCache(text)
        changeSaved(false)
    }
    useEffect(()=>{
        changeTextCache(text)
    }, [text])
    useInterval(() => {
        // Your custom logic here
        
                changeText(textCache, props.editing);
                changeSaved(true)
      }, 2000);
  return (
    <Wrapper  dragHandleClassName='dragHandle'>
    <StyledDiv>
        <Editor editorClassName='editor-textarea'  value={textCache} onChange={(text)=>{changeTextCache(text)}} /> 
        <DragHandle className='dragHandle'><div/>. . .<SaveMessage>{saved ? 'changes saved' : ''} </SaveMessage >  </DragHandle>
        
    </StyledDiv>
      
    </Wrapper>
  );
}
