import styled from "styled-components";
const Polygon = styled.polygon`
  fill-opacity: ${props => props.color ? .5 : 0 };
  stroke-width: ${props => props.selected ? 1.5 : .5};
  stroke: black;
  stroke-opacity: 0.5;
  &:hover {
    fill-opacity: 0.5;
    stroke-width: 1
  }
  fill: ${props => props.color ? props.color : 'grey' }
`;
export default function Hex(props) {
  const { radius, center, ...otherProps } = props;
  if(props.hexData){
    var {color} = props.hexData
  }
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
    var string = strings.toString();
    return points;
  };

  return <Polygon color={color} points={calculatePoints(radius, center)} {...otherProps} />;
}
