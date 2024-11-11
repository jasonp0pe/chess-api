// src/components/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Make sure to create this CSS file for the Home component styles

// Import images
import ChessOverview from '../images/ChessPieces.jpg';

function Home() {
  const [chessPieces, setChessPieces] = useState([]);
  const [isNavOpen, setNavOpen] = useState(false); // State for navbar toggle
  const [formMessage, setFormMessage] = useState(""); // State for form message

  // Fetch chess pieces data from the server
  useEffect(() => {
    fetch('https://your-server-url/render/chess-pieces') // Replace with actual endpoint
      .then((response) => response.json())
      .then((data) => setChessPieces(data))
      .catch((error) => console.error('Error fetching data: ', error));
  }, []); // Empty dependency array means this runs once after the component mounts

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    try {
      const response = await fetch("https://formspree.io/f/xdkoadjg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });

      if (response.ok) {
        setFormMessage("Thank you for reaching out!");
        form.reset();
      } else {
        throw new Error("Failed to send message.");
      }
    } catch (error) {
      setFormMessage("Oops! Something went wrong.");
    }
  };

  return (
    <div className="container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">Chess Pieces Unveiled</Link>
          <button className="nav-toggle" onClick={() => setNavOpen(!isNavOpen)} aria-label="Toggle navigation menu">&#9776;</button>
          <ul className={`nav-menu ${isNavOpen ? 'active' : ''}`}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/king">King</Link></li>
            <li><Link to="/queen">Queen</Link></li>
            <li><Link to="/rook">Rook</Link></li>
            <li><Link to="/bishop">Bishop</Link></li>
            <li><Link to="/knight">Knight</Link></li>
            <li><Link to="/pawn">Pawn</Link></li>
            <li><Link to="/allpieces">View All Pieces</Link></li>
            <li><Link to="/history">History</Link></li>
            <li><Link to="/news">News</Link></li>
            <li><Link to="/stories">Stories</Link></li>
          </ul>
        </div>
      </nav>

      {/* Header */}
      <header>
        <h1>Chess Pieces Unveiled</h1>
      </header>

      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" placeholder="Search..." aria-label="Search" />
      </div>

      {/* Chess Pieces Overview */}
      <section className="overview">
        <img src={ChessOverview} alt="Chess Overview" />
        <div className="pieces-list">
          <Link to="/king" className="chess-piece">King</Link>
          <Link to="/queen" className="chess-piece">Queen</Link>
          <Link to="/rook" className="chess-piece">Rook</Link>
          <Link to="/bishop" className="chess-piece">Bishop</Link>
          <Link to="/knight" className="chess-piece">Knight</Link>
          <Link to="/pawn" className="chess-piece">Pawn</Link>
          <Link to="/allpieces" className="chess-piece all-pieces-link">View All Pieces</Link>
        </div>
      </section>

      {/* Chess Pieces Section */}
      <section className="chess-cards">
        {chessPieces.length > 0 ? (
          chessPieces.map((piece) => (
            <div key={piece._id} className="card">
              <img src={piece.image} alt={piece.name} />
              <h3>{piece.name}</h3>
              <p>{piece.description}</p>
              <Link to={`/${piece.name.toLowerCase()}`} className="learn-more">Learn More</Link>
            </div>
          ))
        ) : (
          <p>Loading chess pieces...</p>
        )}
      </section>

      {/* Contact Me Form Section */}
      <section className="contact-section">
        <h2>Contact Me</h2>
        <form id="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />
          
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
          
          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" required></textarea>
          
          <button type="submit">Submit</button>
          <p id="form-message" style={{ color: formMessage.includes("Thank you") ? "green" : "red" }}>{formMessage}</p>
        </form>
      </section>
    </div>
  );
}

export default Home;
