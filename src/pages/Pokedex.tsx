import React, { useEffect, useState } from 'react';
import './Pokedex.scss';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  List,
  ListItemText,
  Box,
  ListItemButton
} from "@mui/material";
import { Link } from 'react-router-dom';

let IMG_HOME_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

interface Pokemon {
  name: string;
  url: string;
}

interface PokedexProps {
  list: Pokemon[];
  count: number;
}

function Pokedex({list, count} : PokedexProps) {
  const pokemonList: Pokemon[] = list;
  const pokemonCount = count;
  const [currPokemon, setCurr] = useState<Pokemon>(pokemonList[0]);
  const [searchTerm, setTerm] = useState("");
  const [sortMode, setSortMode] = useState("dex-asc");

  const getDexNum = (pokemon: Pokemon): string => {
    const findNum = pokemon.url.match(/\/pokemon\/(\d+)\//);

    if (findNum) {
      return `${findNum[1]}`;
    }

    return "0000";
  };

  const filteredPokemon = pokemonList.filter(
    (p) => p.name.toLowerCase().startsWith(searchTerm.toLowerCase()) || getDexNum(p).startsWith(searchTerm)
  );

  const sortedPokemon = [...filteredPokemon].sort((a, b) => {
    const aDex = parseInt(getDexNum(a));
    const bDex = parseInt(getDexNum(b));

    switch (sortMode) {
      case "dex-asc":
        return aDex - bDex;
      case "dex-desc":
        return bDex - aDex;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  useEffect(() => {
    if (sortedPokemon.length > 0) {
      setCurr(sortedPokemon[0]);
    }
    // eslint-disable-next-line
  }, [searchTerm, sortMode]);

  return (
    <div id='classic'>
      <div id='filters'>
        <TextField
          className="poke-search"
          label="Search for Pokemon"
          type="search"
          variant="filled"
          value={searchTerm}
          onChange={(e) => setTerm(e.target.value)}
        />
        <div id='sort-by'>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              defaultValue="dex-asc"
              onChange={(e) => setSortMode(e.target.value)}
              name="row-radio-buttons-group"
            >
              <FormControlLabel value="dex-asc" control={<Radio />} label="Dex Num. ASC" />
              <FormControlLabel value="dex-desc" control={<Radio />} label="Dex Num. DESC" />
              <FormControlLabel value="name-asc" control={<Radio />} label="Name ASC" />
              <FormControlLabel value="name-desc" control={<Radio />} label="Name DESC" />
            </RadioGroup>
          </FormControl>
        </div>
        <div id='filteredCount'>
          {sortedPokemon.length} out of {pokemonCount}
        </div>
      </div>
      <div id='list'>
        <List id="mui-list">
          {sortedPokemon.map((pokemon) => (
            <ListItemButton
              key={pokemon.name}
              onClick={() => setCurr(pokemon)}
            >
              <ListItemText
                primary={getDexNum(pokemon)}
              />
              <ListItemText
                primary={pokemon.name.toUpperCase()}
              />
            </ListItemButton>
          ))}
        </List>
      </div>
      <div id='poke-image'>
        <div id='poke-image-label'>
          <h2>{currPokemon.name.toUpperCase()}</h2>
        </div>
        <Box id="poke-image-container">
          <img src={`${IMG_HOME_URL}${parseInt(getDexNum(currPokemon))}.png`} alt="Unavailable Sprite" />
        </Box>
        <Link to={`/details/${getDexNum(currPokemon)}/`}>
          <button 
            id='view-details'
          >
            <h3>View Details</h3>
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Pokedex;