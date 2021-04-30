import styled from 'styled-components'
const MessageBox = styled.div`
    border: 1px solid red;
    border-radius: .25rem;
    background-color: rgba(255,0,0,.2);
    max-width: 80%;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 2px;
`
const Message = styled.p`
    color: red;
    margin: auto;
`
export default function ErrorMessage (props){
    return(
        <MessageBox>
            <Message>{props.children}</Message>
        </MessageBox>
    )
}