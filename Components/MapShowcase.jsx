
import MapThumb from './MapThumb.jsx'
import styled from 'styled-components'
const Wrapper = styled.div`
    display: flex
`
export default function MapShowcase ({title, maps, count, ...props}){
    
    return(
        <div>
        {props.children}
        <Wrapper>
            
            {maps ? maps.map((map) => <MapThumb map={map} key={map._id} id={map._id} height={200} width={200} />): <div/>}
        </Wrapper>
        </div>
    )
}