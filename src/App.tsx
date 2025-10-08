import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.scss';
import './pages/Pokedex'
import Pokedex from './pages/Pokedex';
import Gallery from './pages/Gallery';
import Header from './components/Header';
import Footer from './components/Footer';
import Details from './pages/Details';

let API_HOME_URL = "https://pokeapi.co/api/v2/";

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonTypeMap {
  name: string;
  pokemon: any[];
}

function App() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [typeMap, setTypeMap] = useState<PokemonTypeMap[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTypeMap = async (): Promise<void> => {
      const typeMap: PokemonTypeMap[] = [];
      for (let i = 1; i <= 18; i++) {
        const response = await axios.get(`${API_HOME_URL}type/${i}`);
        const data = response.data;

        typeMap.push({
          name: data.name,
          pokemon: data.pokemon
        });
      }
      setTypeMap(typeMap);
    };

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

    fetchTypeMap();
  }, []);

  if (loading) return <p>Loading Pokémon...</p>;
  if (error) return <p>{error}</p>;

  return (
    <BrowserRouter basename="/pokedex">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Pokedex list={pokemonList} count={count}/>} />
          <Route path="/gallery" element={<Gallery list={pokemonList} typeMap={typeMap} />} />
          <Route path="/details/:dexNum" element={<Details list={pokemonList} />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
