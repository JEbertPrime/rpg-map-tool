import mongoose from "mongoose";
var Schema = mongoose.Schema;
import {hex} from './Hex.js'
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
  hexRadius: {
    type: Number,
    required: true,
  },
  hexes: {
    type: [hex],
  },
  since: {
    type: Date,
    default: Date.now,
  },
});

mongoose.models = {};

var Map = mongoose.model("Map", map);

export default Map;