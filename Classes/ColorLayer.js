export default class ColorLayer {
  constructor({ color, indices,text = [], children = [], parent,   }) {
    this._color = color ? color : undefined;
    this._indices = indices ? [...indices] : [];
    this._text = text
    this._parent = parent;
    var self = this
    this._children = makeChildren(children, self)
    function makeChildren(children, parent){
        return children.map(
          (childColor) => {
              childColor =  new ColorLayer({ ...childColor })
              childColor._addParent(parent)
              return childColor}
        );
    }
  }
  
  get color() {
    return this._color;
  }
  set color(color) {
    this._color = color;
  }
  get indices() {
    return this._indices;
  }
  get children() {
    return this._children;
  }
  get parent() {
    return this._parent;
  }
  get text(){
    return this._text
  }
  get childIndices(){
    let indices = []
    this._children.forEach(({childIndices})=> indices = [...indices, ...childIndices] )
    return indices
  }
  _addParent(parent){
    this._parent = parent
  }
  contains(index) {
    if (this.indices.includes(index)) {
      return true;
    } else {
      return false;
    }
  }
  getColorByIndex(index) {
    for (var child in this._children) {
      if (this._children[child].contains(index)) {
        return this._children[child].color;
      }
    }
    
    return undefined;
  }

  addColor(color) {
    this.children.push(new ColorLayer({ color: color, parent:this }));
    return this.children[this.children.length - 1];
  }
  getColorLayer(color) {
    return this.children.find((c) => c.color == color);
  }
  changeChildColor(index, color) {
    let currentColor = this.getColorByIndex(index);
    if (currentColor && currentColor != this._color) {
      this.getColorLayer(currentColor).removeIndex(index);
      this.getColorLayer(color)
        ? this.getColorLayer(color).addIndex(index)
        : this.addColor(color).addIndex(index);
    }
    return true;
  }
  addIndex(index) {
    if (!this._indices.includes(index)) {
      this._indices.push(index);
    }
    return this._indices.length;
  }
  removeIndex(index) {
    let indices = this.indices.filter((i) => i != index);
    this._indices = indices;
    return this._indices;
  }
  changeText(rawState, k){
    if(this._text.find(({key})=> k==key )){

        this._text.find(({key})=>k==key).text = rawState
    }else{

        this._text.push({key:k, text:rawState})
    }
    return this._text
  }
  getTextByKey(k){
    if(this._text.find(({key})=> k==key )){
      return this._text.find(({key})=>k==key).text
  }else{
      return false
  }
  }
  toJson() {
    let layer = {};
    layer.color = this.color;
    layer.indices = this.indices;
    let children = this.children.map((child) => child.toJson());
    layer.children = children;
    return layer;
  }
}
