import connectDB from "../../../../middleware/mongodb.js";
import Map from "../../../../models/Map.js";
import { getSession } from "next-auth/client";

const handler = async (req, res) => {

    if (req.method === "GET") {
          try {
            //Find all maps and return in array
            const maps = await Map.find({ public: true });
            return res.status(200).send(maps);
          } catch (error) {
            return res.status(500).send(error.message);
          }
        }else{
          return res.status(400).send('method not supported')
        }
};

export default connectDB(handler);
