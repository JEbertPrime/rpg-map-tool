import connectDB from "../../../../middleware/mongodb.js";
import Map from "../../../../models/map.js";
import { getSession } from "next-auth/client";
import sanitize from 'mongo-sanitize'
const handler = async (req, res) => {
  const session = await getSession({ req });

  if (session) {
    if (req.method === "POST") {
      // Check if name, email or password is provided
      const clean = sanitize( JSON.parse(req.body))
      const { mapId, user } = clean;
      if (user == session.user.id) {
        if (user && mapId) {
          try {
            //Find single map by id
            const map = await Map.findById(mapId);
            console.log(map);
            return res.status(200).send(map);
          } catch (error) {
            return res.status(500).send(error.message);
          }
        } else if (user) {
          try {
            const maps = await Map.find({ user: user });
            return res.status(200).send(maps);
          } catch (error) {
            return res.status(500).send(error.message);
          }
        } else {
          res.status(422).send("data_incomplete");
        }
      } else {
        res.status(401).send("User id mismatch");
      }
    } else {
      res.status(422).send("req_method_not_supported");
    }
  }
};

export default connectDB(handler);
