import {useContext, useState} from 'react'
import {SessionContext} from '../../contexts/contexts'
import ErrorMessage from '../ErrorMessage'
import {Form, FormGroup, Input, Label, Button} from 'reactstrap'
import styled from 'styled-components'
const FileInputLabel = styled(Label)`
  width: 80%;
  height: 80px;
  border: 1px solid lightgrey;
  border-radius: 0.25rem;
  text-align: center;
  padding-top: 15px;
`;
export default function MapUpload ({onFile, onRadius, onTitle, mapTitle, radius, onSubmitMap, file}){
    var [session] = useContext(SessionContext)
    var [titleError, changeTitleError] = useState(false);
    var [fileError, changeFileError] = useState(false);
    var [submitError, changeSubmitError] = useState(false);
    var [uploadError, changeUploadError] = useState(false)
      
      const uploadPhoto = async (file) => {
        const filename = encodeURIComponent(file.name);
        const res = await fetch(`/api/uploadMap?file=${filename}`);
        const { url, fields } = await res.json();
        const formData = new FormData();
    
        Object.entries({ ...fields, file }).forEach(([key, value]) => {
          formData.append(key, value);
        });
        const upload = await fetch(url, {
          method: 'POST',
          body: formData,
          
        });
        
    
        if (upload.ok) {
            return filename        
        } else {
          return false
        }
      };
      const uploadMap = async () =>{
          changeSubmitError(false)
          changeTitleError(false)
          changeFileError(false)
          changeUploadError(false)
          if(session){
          
          if(mapTitle==''|| mapTitle.length == 0){
            console.log('error')
             changeTitleError(true)
          }
          
          if(!file){
            changeFileError(true)
         }
          var imageName = await uploadPhoto(file)
          
          if(titleError || fileError || submitError){
            return
          }
        var map = {
          hexRadius: radius,
            title: mapTitle,
            user: session.user.id,
            fileName: imageName

        }
          if(imageName){
            var created = await fetch('api/maps/user/upload', {
                method: 'POST',
                body: JSON.stringify(map)
            })
            return onSubmitMap(created.status == 201  ? imageName : false)
          }else{
            changeUploadError(true)
            return
          }
        }else{
          changeSubmitError(true)
           return false
        }
      }
    
    return (<Form>
    <Label>
      Hex Radius
      <Input
        type="number"
        step={0.1}
        value={radius}
        onChange={(e) => {
          onRadius(+e.target.value);
        }}
        max={40}
        min={10}
      />
      <Input
        value={radius}
        type="range"
        onChange={(e) => onRadius(+e.target.value)}
        step={1}
        max={40}
        min={10}
      />
    </Label>
    <FormGroup>
      <Label>
        Map Title
        <Input
          type="text"
          onChange={(e) => onTitle(e.target.value)}
          value={mapTitle}
        />
        {titleError ? <ErrorMessage>Please enter a map title</ErrorMessage>: <></>}
      </Label>
    </FormGroup>

    <FileInputLabel>
      <Input
        type="file"
        onChange={onFile}
        style={{ display: "none" }}
      />
      <strong>Drag</strong> map or select file <br/>(max size: 1mb)
    </FileInputLabel>
    {fileError ? <ErrorMessage>Please upload a map (max size: 1mb)</ErrorMessage>: <></>}
    <FormGroup>
      <Button onClick={uploadMap}>Submit</Button>
      {submitError ? <ErrorMessage>Please log in to submit a map</ErrorMessage>: <></>}
      {uploadError ? <ErrorMessage>Something went wrong with your upload. Make sure your file is less than 1MB.</ErrorMessage>: <></>}
    </FormGroup>
  </Form>
    )
}