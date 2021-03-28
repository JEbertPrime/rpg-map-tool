import connectDB from "../../../../middleware/mongodb.js";
import Map from "../../../../models/map.js";
import { getSession } from "next-auth/client";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    if (req.method === "POST") {
      // Check if name, email or password is provided
      const { title, fileName, user, hexRadius } = JSON.parse(req.body);
      console.log(title,fileName,user,hexRadius)
      if (title && fileName && user) {
        try {
          var map = new Map({
            user,
            title,
            fileName,
            hexRadius
          });
          // Create new map
          var mapcreated = await map.save();
          return res.status(201).send(mapcreated);
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
