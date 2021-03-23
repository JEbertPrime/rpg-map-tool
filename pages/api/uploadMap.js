// Backend
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.uploadDir = "./public/maps/";
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.send({ status: 400, error: err });
      }
      if (files != {}) {
        res.send({ status: 200, path: files.map.path });
      }
    });
  } catch (err) {
    console.log(err);
  }
};
