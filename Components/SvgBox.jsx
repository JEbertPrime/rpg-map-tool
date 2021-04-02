import styled from "styled-components";
import { hexbin as Hexbin } from "d3-hexbin";
import { zoom as d3Zoom, zoom } from "d3-zoom";
import { select } from "d3";
import { useEffect, useState, memo } from "react";

//components
import Hex from "./SVGElements/Hex.jsx";
const MemoHex = memo(Hex)
export default function svgBox(props) {
  var w = parseInt(props.width);
  var [h, changeHeight] = useState((w * 2) / 3);
  var r =  props.radius < 10 ? 10 : props.radius > 40 ? 40 : props.radius
  
    
  var [zoomG, changeZoomG] = useState({})
  var [zoomBehavior, changeZoom] = useState()
  var draggable = false;
  var dx = 0,
    dy = 0;
  var [bin, changeBin] = useState([]);
    
  useEffect(() => {
    const hexbin = Hexbin()
      .extent([
        [0, 0],
        [w, h],
      ])
      .radius(r);

    var data = [];
    for (var i = 0; i < h; i += r) {
      for (var j = 0; j < w; j +=r) {
        data.push([j, i]);
      }
    }
    
    changeBin(hexbin(data));
    var zoomGroup = select("#zoom");
    var zoomCall = d3Zoom()
    .on("zoom", ({ transform }) => {
      props.onZoom ? props.onZoom() : null;
      zoomGroup.attr("transform", transform);
    })
    .scaleExtent([1, 10])
    .translateExtent([
      [0, 0],
      [w, h],
    ])
    .filter((event)=>{
      return  !event.ctrlKey && !event.button && props.tool === 4 ||( event.type == 'wheel' && !event.ctrlKey && !event.button)
    })
    zoomGroup.call(
        zoomCall
    );
    
    
    return zoomGroup.on("zoom", null);
  }, [r, h, props.tool]);
  const resizeToImage = () => {
    var image = select("image");
    var imageHeight = image.node().getBBox().height;

    changeHeight(imageHeight);
  };
  var testButton = props.test ? <button id='buttonTest'  /> : null
  return (
      <div>

    <svg
      id="map-svg"
      width="100%"
      style={{
        maxHeight: "80vh",
      }}
      viewBox={`0 0 ${w} ${h}`}
    >
      <g id="zoom" data-testid='zoom'>
        <image
          href={props.url}
          width="100%"
          preserveAspectRatio="true"
          onLoad={resizeToImage}
        />
        <clipPath id="map">
          <rect width={w} height={h} fill="none" />
        </clipPath>
        <g clipPath="url(#map">
          {bin.map((hex, index) => {

          return(
            <MemoHex
              center={{ x: hex.x, y: hex.y }}
              radius={r}
              selected={props.selectedHexes.includes(index)}
              hexData={props.hexes[index] ? props.hexes[index] : false}
              key={`hex_${Math.trunc(hex.x)}_${Math.trunc(hex.y)}`}
              onClick={(e)=>{
                props.onHexEvent(e, index)
              }}
              onMouseMove={(e)=>{
                props.onHexEvent(e, index)
              }}
              onMouseUp={(e)=>{
                props.onHexEvent(e, index)
              }}
              onMouseDown={(e)=>{
                props.onHexEvent(e, index)
              }}
            />
          )
          })}
        </g>
      </g>
    </svg>
    </div>
  );
}
