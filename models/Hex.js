import mongoose from "mongoose";
var Schema = mongoose.Schema;

export const hex = new Schema({
  hexId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  centerPoint: {
      type: [Number],
      required: true
  },
  terrain: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
  },
  travelModifier: {
    type: Number,
    required: false,
  },
  notes: {
    type: {},
  },
  since: {
    type: Date,
    default: Date.now,
  },
});

mongoose.models = {};

var Hex = mongoose.model("Hex", hex);

export default Hex;
