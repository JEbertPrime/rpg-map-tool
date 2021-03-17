import styled from 'styled-components';
import {hexbin as Hexbin} from "d3-hexbin";
import {zoom as d3Zoom} from 'd3-zoom'
import {select} from 'd3'
import { useEffect, useState } from 'react'

//components
import Hex from './SVGElements/Hex.jsx'

export default function svgBox (props){
    var w = parseInt(props.width)
    var[ h, changeHeight] = useState(w*2/3)
    var r = props.radius
    var draggable = false
    var dx = 0, dy = 0
    var [bin, changeBin] = useState([])
    
    useEffect(()=>{
        
        const hexbin = Hexbin().extent([[0,0], [w,h]]).radius(props.radius)
        
        var data = []
        for(var i = 0; i < h  ; i+=props.radius){
            for(var j = 0; j< w ; j+=props.radius){
                data.push([j,i])
            }
        }
        
        changeBin(hexbin(data))
        var zoomGroup = select('#zoom')
        zoomGroup.call(d3Zoom().on('zoom', ({transform})=>{
            zoomGroup.attr('transform', transform)
        }).scaleExtent([1,10]).translateExtent([[0,0], [w,h]])
        )

        return zoomGroup.on('zoom', null)
    }, [props.radius, h]
    )
    const resizeToImage = () =>{
        var image = select('image')
        var imageHeight = image.node().getBBox().height
        
        changeHeight(imageHeight)
    }
    return(
        <svg id='map-svg' width={w} height={h}>
        <g id='zoom'>
            <image href={props.url} width={w}  preserveAspectRatio='true' onLoad={resizeToImage}/>
            {bin.map((hex)=> <Hex center={{x:hex.x, y: hex.y}} radius={props.radius} id={`hex_${Math.trunc(hex.x)}_${Math.trunc(hex.y)}`} /> )}
        </g>
            

        </svg>
    )
}