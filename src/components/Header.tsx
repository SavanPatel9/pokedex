import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
        <h1>Pokedex</h1>
        <nav>
            <Link className='link' to="/">Pokedex</Link>
            <Link className='link' to="/gallery">Gallery</Link>
        </nav>
    </header>
  );
}

export default Header;