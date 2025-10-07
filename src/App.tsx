import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.scss';
import './pages/Pokedex'
import Pokedex from './pages/Pokedex';
import Gallery from './pages/Gallery';
import Header from './components/Header';
import Footer from './components/Footer';

let API_HOME_URL = "https://pokeapi.co/api/v2/";

interface Pokemon {
  name: string;
  url: string;
}

function App() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let pokemonURL = `${API_HOME_URL}pokemon`;

    axios.get(pokemonURL, {
      params: {
        limit: 10000,
        offset: 0
      }
    })
      .then((response) => {
        setPokemonList(response.data.results)
        setCount(response.data.count)
      })
      .catch((error) => {
        setError(error)
      })
      .finally(() => {
        console.log("API Complete!");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading Pokémon...</p>;
  if (error) return <p>{error}</p>;

  return (
    <BrowserRouter basename="/pokedex">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Pokedex list={pokemonList} count={count}/>} />
          <Route path="/gallery" element={<Gallery list={pokemonList} />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
