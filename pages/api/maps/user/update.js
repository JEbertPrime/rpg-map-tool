import connectDB from "../../../../middleware/mongodb.js";
import Map from "../../../../models/Map.js";
import { getSession } from "next-auth/client";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    if (req.method === "PUT") {
      const {
        mapId,
        title,
        fileName,
        hexRadius,
        colors,
        terrains,
        text,
      } = JSON.parse(req.body);
      if (mapId) {
        try {
          // Create new map
          var map = await Map.findOne({ _id: mapId });
          if (map.user == session.user.id) {
            map.colors = colors ? colors : map.colors;
            map.terrains = terrains ? terrains : map.terrains;
            map.text = text ? text : map.text;
            map.title = title ? title : map.title;
            var saved = await map.save();
            return res.status(200).send(saved);
          } else {
            res.status(401).send("user id mismatch");
          }
        } catch (error) {
          return res.status(500).send(error.message);
        }
      } else {
        res.status(422).send("data_incomplete");
      }
    } else {
      res.status(422).send("req_method_not_supported");
    }
  } else {
    res.status(401);
  }
};

export default connectDB(handler);
