import styled from "styled-components";
import {
  GiForest,
  GiMountainCave,
  GiDesert,
  GiSnowflake2,
  GiSandCastle,
  GiGrass,
  GiSwamp,
  GiDeathSkull,
} from "react-icons/gi"
import { useMemo } from "react";
const TerrainIcons = [
  { icon: GiForest, terrain: "forest", tool:'terrain' },
  { icon: GiMountainCave, terrain: "mountain", tool:'terrain' },
  { icon: GiDesert, terrain: "desert", tool:'terrain' },
  { icon: GiSnowflake2, terrain: "arctic", tool:'terrain' },
  { icon: GiSandCastle, terrain: "coast", tool:'terrain' },
  { icon: GiGrass, terrain: "grassland", tool:'terrain' },
  { icon: GiSwamp, terrain: "wetland", tool:'terrain' },
  { icon: GiDeathSkull, terrain: "underdark", tool:'terrain' },
];
const Polygon = styled.polygon`
  fill-opacity: ${props => props.color ? .5 : 0 };
  stroke-width: ${props => props.selected ? props.byColor ? .5 : 1.5 : props.byColor ? 0 : .5};
  stroke: black;
  stroke-opacity: 0.5;
  &:hover {
    fill-opacity: 0.5;
    stroke-width: 1
  }
  fill: ${props => props.color ? props.color : 'grey' }
`;
export default function Hex(props) {
  const { radius, center, terrain, ...otherProps } = props;
    var Icon = terrain ? TerrainIcons.find((i)=> i.terrain==terrain).icon : false
  
  
  const calculatePoints = (r, c) => {
    function toRadians(angle) {
      return angle * (Math.PI / 180);
    }
    var angles = [30, 90, 150, 210, 270, 330];
    var points = angles.map((angle) => [
      c.x + r * Math.cos(toRadians(angle)),
      c.y + r * Math.sin(toRadians(angle)),
    ]);
    var strings = points.map((point) => point.toString());
    return points;
  };
  var points = useMemo(()=>calculatePoints(radius, center), [radius, center])
  var content = <Polygon  points={points} {...otherProps} />
  if(terrain){
    content = <g>
     
      <Polygon points={points} {...otherProps} />
      <Icon style={{pointerEvents:'none'}} clipPath={'url(#' + props.index + ')'} x={center.x - radius*.67} y={center.y - radius*.67} color='rgba(0,0,0,.5)' size={radius*1.3333 + 'px'} height={radius + 'px'}/>
    </g>
  }
  return content
}
