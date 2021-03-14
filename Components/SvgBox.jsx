import styled from 'styled-components';
import {hexbin as Hexbin} from "d3-hexbin";
import {zoom as d3Zoom} from 'd3-zoom'
import {drag as d3Drag} from 'd3-drag'
import * as d3 from 'd3'
import { useEffect, useState } from 'react'
import { formatPrefix } from 'd3';

export default function svgBox (props){
    var w = props.width
    var h = 400
    var r = props.radius
    var draggable = false
    var dx = 0, dy = 0
    useEffect(()=>{
        
        const hexbin = Hexbin().extent([[0,0], [w,h]]).radius(props.radius)

        var data = []
        for(var i = 0; i < h + 100 ; i+=props.radius){
            for(var j = 0; j< w + 100; j+=props.radius){
                data.push([j,i])
            }
        }
        console.log(hexbin(data), data)
        var bin = hexbin(data)
        var svg = d3.select('#map-svg')
        
        var zoomGroup = svg.append('g')
        var hexGroup = zoomGroup.append('g')
        hexGroup.selectAll("path")
        .data(bin)
        .enter().append("path")
        
            .attr("d", d => `M${d.x},${d.y}${hexbin.hexagon()}`)
            .style('fill', 'grey')
            .style('fill-opacity', .0)
            .style('stroke', 'blue')
            .on('mouseover', function () {
                d3.select(this).style('fill-opacity', .5)
            })
            .on('mouseout', function () {
                d3.select(this).style('fill-opacity', 0)
            })
            
        svg.call(d3Zoom().on('zoom', ({transform}) => {
            zoomGroup.attr('transform', transform)
        }).on('end', ({transform})=>{
            zoomGroup.selectAll('path').attr('stroke-width', 1/transform.k)

        })
        .scaleExtent([1, 20])
        .translateExtent([[0,0],[w,h]]))
        return () => svg.selectAll('*').remove();
    }, [props.radius]
    )
    
    return(
        <svg id='map-svg' width={w} height={h}>

        </svg>
    )
}