import connectDB from "../../../middleware/mongodb.js";
import Map from "../../../models/map.js";
import { getSession } from "next-auth/client";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (req.method === "GET") {
    // Check if name, email or password is provided
    const { title, fileName, user, hexRadius } = JSON.parse(req.body);
    if (title && fileName && user) {
      try {
        // Hash password to store it in DB
        var map = new Map({
          user,
          title,
          fileName,
          hexRadius,
        });
        // Create new user
        var mapcreated = await map.save();
        return res.status(200).send(mapcreated);
      } catch (error) {
        return res.status(500).send(error.message);
      }
    } else {
      res.status(422).send("data_incomplete");
    }
  } else {
    res.status(422).send("req_method_not_supported");
  }
};

export default connectDB(handler);
