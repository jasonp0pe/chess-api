const express = require('express');
const cors = require('cors');
const path = require('path');
const Joi = require('joi');
const multer = require('multer');  // Import multer for file handling

const app = express();

// Setup multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save with unique filenames
  }
});
const upload = multer({ storage: storage });

// Middleware setup
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (images)
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Array of chess pieces data
let chessPieces = [
  {
    _id: 1,
    name: "King",
    description: "The King can move one square in any direction.",
    image: "/images/LightKing.jpg",  
  },
  {
    _id: 2,
    name: "Queen",
    description: "The Queen is the most powerful piece on the board.",
    image: "/images/LightQueen.jpg", 
  },
  {
    _id: 3,
    name: "Rook",
    description: "The Rook moves horizontally or vertically through any number of unoccupied squares.",
    image: "/images/LightRook.jpg",  
  },
  {
    _id: 4,
    name: "Bishop",
    description: "The Bishop moves diagonally through any number of unoccupied squares.",
    image: "/images/LightBishop.jpg", 
  },
  {
    _id: 5,
    name: "Knight",
    description: "The Knight moves in an 'L' shape and can jump over other pieces.",
    image: "/images/LightKnight.jpg", 
  },
  {
    _id: 6,
    name: "Pawn",
    description: "The Pawn moves forward one square or two squares on its first move.",
    image: "/images/LightPawn.jpg", 
  }
];

// Joi validation schema for chess piece
const chessPieceSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 3 characters long',
    'any.required': 'Name is required'
  }),
  description: Joi.string().min(10).required().messages({
    'string.empty': 'Description cannot be empty',
    'string.min': 'Description must be at least 10 characters long',
    'any.required': 'Description is required'
  }),
  image: Joi.string().uri().optional().messages({
    'string.empty': 'Image cannot be empty',
    'any.required': 'Image is required'
  })
});

// POST request to add a new chess piece
app.post('/chess-pieces', upload.single('image'), (req, res) => {
  const { error, value } = chessPieceSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  let imagePath = '';
  if (req.file) {
    imagePath = '/images/' + req.file.filename;
  }

  // If no image is uploaded and no image URL is provided, return an error
  if (!imagePath && !value.image) {
    return res.status(400).json({
      success: false,
      message: 'Image is required.'
    });
  }

  const newChessPiece = {
    _id: chessPieces.length + 1,
    name: value.name,
    description: value.description,
    image: imagePath || value.image
  };

  chessPieces.push(newChessPiece);

  res.status(201).json({
    success: true,
    message: 'Chess piece added successfully!',
    data: newChessPiece
  });
});

// PUT request to edit a chess piece
app.put('/chess-pieces/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { error, value } = chessPieceSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  const chessPiece = chessPieces.find(piece => piece._id == id);

  if (!chessPiece) {
    return res.status(404).json({
      success: false,
      message: 'Chess piece not found.'
    });
  }

  // Update chess piece fields
  chessPiece.name = value.name || chessPiece.name;
  chessPiece.description = value.description || chessPiece.description;
  
  if (req.file) {
    chessPiece.image = '/images/' + req.file.filename;
  }

  res.status(200).json({
    success: true,
    message: 'Chess piece updated successfully!',
    data: chessPiece
  });
});

// DELETE request to delete a chess piece
app.delete('/chess-pieces/:id', (req, res) => {
  const { id } = req.params;
  const index = chessPieces.findIndex(piece => piece._id == id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Chess piece not found.'
    });
  }

  chessPieces.splice(index, 1); // Remove the chess piece from the array

  res.status(200).json({
    success: true,
    message: 'Chess piece deleted successfully!'
  });
});

// API endpoint to fetch chess pieces
app.get('/chess-pieces', (req, res) => {
  res.json(chessPieces); // Send the array as a JSON response
});

// Home route to display API documentation
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Chess Pieces API</title>
        <link rel="stylesheet" href="/style.css"> 
      </head>
      <body>
        <h1>Chess Pieces API</h1>
        <p>Get All Chess Pieces:</p>
        <a href="/chess-pieces">All Chess Pieces</a>
        <h2>Add New Chess Piece (POST):</h2>
        <p>Send a POST request to <code>/chess-pieces</code> with the required data, including an image.</p>
        <h2>Edit Chess Piece (PUT):</h2>
        <p>Send a PUT request to <code>/chess-pieces/:id</code> to edit a specific chess piece.</p>
        <h2>Delete Chess Piece (DELETE):</h2>
        <p>Send a DELETE request to <code>/chess-pieces/:id</code> to delete a specific chess piece.</p>
      </body>
    </html>
  `);
});

// Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
