import styled from "styled-components";
const Child = styled.div`
  display: none;
  align-items: center;
`;
const Parent = styled.div`
  &:hover ${Child} {
    display: block;
  }
  border-radius: 10px;
`;
const Wrapper = styled.div`
    margin:5px
`
const MapTitle = styled.h3`
    text-overflow:ellipsis;
`

export default function MapThumb({
  width,
  height,
  onClick,
  id,
  map,
  ...props
}) {
  var content = (
    <Wrapper>
      <MapTitle>{map.title}</MapTitle>
      <Parent
        id={id}
        onClick={onClick}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundImage: `url(${map.file})`,
          backgroundSize: "cover",
        }}
      >
        <Child>{props.children}</Child>
      </Parent>
    </Wrapper>
  );

  return content;
}
