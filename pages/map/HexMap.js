import ColorLayer from './ColorLayer'
import equal from 'deep-equal'
export default class HexMap {
  constructor(mapData) {
    this.mapData = { ...mapData };
    console.log(this.mapData)
    this._id = this.mapData._id
    this._colors = mapData.colors[0] ? new ColorLayer(mapData.colors[0]) : new ColorLayer({color: undefined, indices: []})
    this._terrains = this.mapData.terrains ? this.mapData.terrains : []
    this._radius = this.mapData.hexRadius
    this._title = this.mapData.title
    this._user = this.mapData.user
    this._fileName = this.mapData.fileName
    this.initial = {
        colors : this._colors.toJson(),
        terrains: [...this._terrains]

    }
  }
  get colors() {
    return this._colors;
  }
  set colors(c){
    this._colors=c
  }
 
  get terrains() {
    return this._terrains;
  }
  get radius() {
    return this._radius;
  }
  get title() {
    return this._title;
  }
  get user() {
    return this._user;
  }
  get id() {
    return this._id;
  }
  set id(id){
      this._id = id
  }
 
  get file() {
      return this._fileName
  }
   getTerrainByIndex = (index)=>{
      var ter = this._terrains.find(({indices})=> indices.includes(index))
      return ter ? ter.terrain : undefined
  }
  changeTerrain(index, t){
      let terrain = this._terrains.find(({terrain})=> terrain == t )
      let currentTerrain = this._terrains.find(({indices})=>indices.includes(index))
      if(currentTerrain){
        let index = currentTerrain.indices.indexOf(index)
        currentTerrain.indices.splice(index, 1)
    }
      if(t=='erase'){
        
            let ter = this._terrains.find(({indices})=> indices.includes(index))
            let index = ter.indices.indexOf(index)
            ter.indices.splice(index, 1)
        
        return this._terrains
      }
    if(terrain){
        
            if(!terrain.indices.includes(index)){
            terrain.indices.push(index)
        
        return this._terrains
    }
        
    }else{
        this._terrains.push({terrain:t, indices: [index]})
        return this._terrains
    }
  }
  
  
  update(){
    var update = {}
    update.colors = equal(this.initial.colors, this.colors.toJson()) ? undefined : this.colors.toJson()
    update.terrains = equal(this.initial.terrains, this.terrains) ? undefined : this.terrains
    update.mapId = this.id
    fetch("api/maps/user/update", {
        method: "PUT",
        body: JSON.stringify(update)
    }).then((response)=>{return {response: response, status : response.status}}).then(({response, status})=>{
        if(status != 200){
            return'error'
        }else{
            return response.json()
        }
    })
  }
  delete(){
    const data = JSON.stringify({
        mapId: this.id,
      });
      fetch("api/maps/user/delete", {
        method: "DELETE",
        body: data,
      })
        .then((response) => response.status)
        .then((status) => {
          if (status === 200) {
            return 'deleted'
          }else{
              return 'error'
          }
        });
  }

}
