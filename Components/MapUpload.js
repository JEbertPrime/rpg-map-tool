import {useContext} from 'react'
import {SessionContext} from '../contexts/contexts'

import {Form, FormGroup, Input, Label, Button} from 'reactstrap'
import styled from 'styled-components'
const FileInputLabel = styled(Label)`
  width: 80%;
  height: 80px;
  border: 1px solid lightgrey;
  border-radius: 0.25rem;
  text-align: center;
  padding-top: 25px;
`;
export default function MapUpload ({onFile, onRadius, onTitle, mapTitle, radius, onSubmitMap, file}){
    var [session] = useContext(SessionContext)
    
      const uploadPhoto = async () => {
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
          console.error('Upload failed.');
          return false
        }
      };
      const uploadMap = async () =>{
        
          if(session){
          var imageName = await uploadPhoto()
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
          }
        }else{
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
      </Label>
    </FormGroup>

    <FileInputLabel>
      <Input
        type="file"
        onChange={onFile}
        style={{ display: "none" }}
      />
      <strong>Drag</strong> map or select file
    </FileInputLabel>
    <FormGroup>
      <Button onClick={uploadMap}>Submit</Button>
    </FormGroup>
  </Form>
    )
}