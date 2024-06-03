const stream = require("stream");
const express = require("express");
const multer = require("multer");
const path = require("path");
const { google } = require("googleapis");
const app = express();
const upload = multer();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

exports.uploadAssignmentFile = async (req, res) => {
  // console.log(req);
  console.log("req.body ", req.body);
  const { google } = require("googleapis");
  const uploadFile = async (req, res, fileObject) => {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);
    const { data } = await google.drive({ version: "v3", auth }).files.create({
      media: {
        mimeType: fileObject.mimeType,
        body: bufferStream,
      },
      requestBody: {
        name: fileObject.originalname,
        parents: ["1Y8UmJf3O4AyLkOx2c03N5RoYqDxdMZ2_"],
      },
      fields: "id,name",
    });
    console.log(`Uploaded file ${data.name} ${data.id}`);
    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: data,
    });
  };
  console.log("dirname ", __dirname);
  const KEYFILEPATH = path.join(__dirname, "../utils/my-blog-app-gdrive.json");
  const SCOPES = ["https://www.googleapis.com/auth/drive"];

  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
  });

  console.log(auth);
  try {
    console.log("req.body ", req.body);
    console.log(req.files);
    const { body, files } = req;

    let resp = "";
    for (let f = 0; f < files.length; f += 1) {
      resp = await uploadFile(req, res, files[f]);
    }

    console.log(resp);
    // res.status(200).send("Form Submitted");
  } catch (f) {
    res.send(f.message);
  }
};

// const uploadFile = async (fileObject) => {
//     const bufferStream = new stream.PassThrough();
//     bufferStream.end(fileObject.buffer);
//     const { data } = await google.drive({ version: "v3", auth }).files.create({
//         media: {
//             mimeType: fileObject.mimeType,
//             body: bufferStream,
//         },
//         requestBody: {
//             name: fileObject.originalname,
//             parents: ["1uAT688HRRow3dHAjh71V-0K_b-dIhl8A"],
//         },
//         fields: "id,name",
//     });
//     console.log(`Uploaded file ${data.name} ${data.id}`);
// };
