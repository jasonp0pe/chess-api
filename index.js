const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allow cross-origin requests

// Array of chess pieces data
const chessPieces = [
  {
    _id: 1,
    name: "King",
    description: "The King can move one square in any direction.",
    image: "images/LightKing.jpg",
  },
  {
    _id: 2,
    name: "Queen",
    description: "The Queen is the most powerful piece on the board.",
    image: "images/LightQueen.jpg",
  },
  {
    _id: 3,
    name: "Rook",
    description: "The Rook moves horizontally or vertically through any number of unoccupied squares.",
    image: "images/LightRook.jpg",
  },
  {
    _id: 4,
    name: "Bishop",
    description: "The Bishop moves diagonally through any number of unoccupied squares.",
    image: "images/LightBishop.jpg",
  },
  {
    _id: 5,
    name: "Knight",
    description: "The Knight moves in an 'L' shape and can jump over other pieces.",
    image: "images/LightKnight.jpg",
  },
  {
    _id: 6,
    name: "Pawn",
    description: "The Pawn moves forward one square or two squares on its first move.",
    image: "images/LightPawn.jpg",
  },
];

// API endpoint to fetch chess pieces
app.get('/chess-pieces', (req, res) => {
  res.json(chessPieces); // Send the array as JSON response
});

// Serve static files (images)
app.use(express.static('public'));

// Show available API requests
app.get('/', (req, res) => {
  res.send(`
    <h1>Chess Pieces API</h1>
    <p>Get All Chess Pieces:</p>
    <a href="/chess-pieces">All Chess Pieces</a>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
