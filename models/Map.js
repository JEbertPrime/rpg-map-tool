import mongoose from "mongoose";
var Schema = mongoose.Schema;
import {hex} from './Hex.js'
var color = new Schema({
    color: {type: String},
    indices: [Number]

})
color.add({children: [color]})
var terrain = new Schema({
  terrain: {type: String},
  indices: [Number]
})
var map = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  text: [{
    key: String,
    text: {type: Schema.Types.Mixed}
  }],
  hexRadius: {
    type: Number,
    required: true,
  },
  colors: [color],
  terrains: [terrain],
  since: {
    type: Date,
    default: Date.now,
  },
});

mongoose.models = {};

var Map = mongoose.model("Map", map);

export default Map;
