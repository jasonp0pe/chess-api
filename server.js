const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });

mongoose
  .connect(
    "mongodb+srv://jjpope:elainejones@cluster0.qxk0l.mongodb.net/chesspieces?retryWrites=true&w=majority"
  )

  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("couldn't connect to mongodb", error);
  });

// Chess Piece Schema
const chessPieceSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,  // Stores the image path (from public/images)
});

const ChessPiece = mongoose.model("ChessPiece", chessPieceSchema);

// GET request for all chess pieces
app.get("/chess-pieces", async (req, res) => {
  const chessPieces = await ChessPiece.find();
  res.send(chessPieces);
});

// GET request for a single chess piece by ID
app.get("/chess-pieces/:id", async (req, res) => {
  const chessPiece = await ChessPiece.findOne({ _id: id });
  res.send(chessPiece);
});

// POST request to add a new chess piece (with image)
app.post("/chess-pieces", upload.single("img"), async (req, res) => {
  const result = validateChessPiece(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const chessPiece = new ChessPiece({
    name: req.body.name,
    description: req.body.description,
  });

  if (req.file) {
    chessPiece.image = "/images/" + req.file.filename;  // Store the image path
  }

  const newChessPiece = await chessPiece.save();
  res.send(newChessPiece);
});

// PUT request to edit an existing chess piece (with image update)
app.put("/chess-pieces/:id", upload.single("image"), async (req, res) => {
  const result = validateChessPiece(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const chessPiece = await ChessPiece.findById(req.params.id);

  if (!chessPiece) {
    return res.status(404).send("Chess piece not found.");
  }

  chessPiece.name = req.body.name || chessPiece.name;
  chessPiece.description = req.body.description || chessPiece.description;

  if (req.file) {
    chessPiece.image = "/images/" + req.file.filename;  // Update the image if provided
  }

  await chessPiece.save();
  res.send(chessPiece);
});

// DELETE request to delete a chess piece
app.delete("/chess-pieces/:id", async (req, res) => {
  const chessPiece = await ChessPiece.findByIdAndDelete(req.params.id);
  if (!chessPiece) {
    return res.status(404).send("Chess piece not found.");
  }
  res.send(chessPiece);
});

// Joi Validation for Chess Piece
const validateChessPiece = (chessPiece) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    image: Joi.string().uri().optional(),
  });

  return schema.validate(chessPiece);
};

app.listen(3002, () => {
  console.log("I'm listening on port 3002");
});
