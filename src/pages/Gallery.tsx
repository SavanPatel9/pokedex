import React, { useState } from 'react';
import './Gallery.scss';
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

// let IMG_HOME_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
let TYPE_HOME_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/";

interface Pokemon {
  name: string;
  url: string;
}

const pokemonTypes = [
  { id: 1, name: "normal" },
  { id: 2, name: "fighting" },
  { id: 3, name: "flying" },
  { id: 4, name: "poison" },
  { id: 5, name: "ground" },
  { id: 6, name: "rock" },
  { id: 7, name: "bug" },
  { id: 8, name: "ghost" },
  { id: 9, name: "steel" },
  { id: 10, name: "fire" },
  { id: 11, name: "water" },
  { id: 12, name: "grass" },
  { id: 13, name: "electric" },
  { id: 14, name: "psychic" },
  { id: 15, name: "ice" },
  { id: 16, name: "dragon" },
  { id: 17, name: "dark" },
  { id: 18, name: "fairy" },
];

interface PokedexProps {
  list: Pokemon[];
}

function Gallery({list} : PokedexProps) {
  const pokemonList: Pokemon[] = list;
  const [searchTerm, setTerm] = useState("");
  const [sortMode, setSortMode] = useState("dex-asc");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setSelectedTypes(typeof value === "string" ? value.split(",") : value);
  };

  const getDexNum = (pokemon: Pokemon): string => {
    const findNum = pokemon.url.match(/\/pokemon\/(\d+)\//);

    if (findNum) {
      return `${findNum[1]}`;
    }

    return "0000";
  };

  const filteredPokemon = pokemonList.filter(
    (p, index) => p.name.toLowerCase().startsWith(searchTerm.toLowerCase()) || (index + 1).toString().startsWith(searchTerm)
  );

  // eslint-disable-next-line
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

  return (
    <div id='gallery'>
      <div id='filters'>
        <TextField
          id="poke-search"
          label="Search for Pokemon"
          type="search"
          variant="filled"
          value={searchTerm}
          onChange={(e) => setTerm(e.target.value)}
          sx={{ m: 2 }}
        />
        <div id='sort-by'>
          <FormControl id="button-group">
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              defaultValue="dex-asc"
              onChange={(e) => setSortMode(e.target.value)}
              name="row-radio-buttons-group"
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr"
              }}
            >
              <FormControlLabel value="dex-asc" control={<Radio />} label="Dex Num. ASC" />
              <FormControlLabel value="dex-desc" control={<Radio />} label="Dex Num. DESC" />
              <FormControlLabel value="name-asc" control={<Radio />} label="Name ASC" />
              <FormControlLabel value="name-desc" control={<Radio />} label="Name DESC" />
            </RadioGroup>
          </FormControl>
        </div>
        <div id='typeFilters'>
          <Button 
            variant="outlined" 
            startIcon={<DeleteIcon />}
            sx={{
              width: 100,
              height: 56
            }}
            onClick={() => setSelectedTypes([])}
          >
            Reset
          </Button>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel 
              sx={{m: 1}}
            >
              Select Types
            </InputLabel>
            <Select
              multiple
              value={selectedTypes}
              onChange={handleChange}
              input={<OutlinedInput label="Select Types" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((type) => (
                    <Chip key={type} label={type} />
                  ))}
                </Box>
              )}
              sx={{m: 1}}
            >
              {pokemonTypes.map((type) => (
                <MenuItem 
                  key={type.id}
                  value={type.name}
                  sx={{
                    height: 36,
                    paddingY: 0.5,
                  }}
                >
                  <img 
                    src={`${TYPE_HOME_URL}${type.id}.png`} 
                    alt={type.name}
                    style={{
                      height: 30,
                      width: "auto",
                      objectFit: "contain",
                      margin: "0 auto"
                    }}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
      <div id='poke-container'>
        <div className='poke-grid'>
          <div className='grid-item'></div>
          <div className='grid-item'></div>
          <div className='grid-item'></div>
          <div className='grid-item'></div>
          <div className='grid-item'></div>
          <div className='grid-item'></div>
          <div className='grid-item'></div>
          <div className='grid-item'></div>
          <div className='grid-item'></div>
        </div>
        <button className="gallery-button prev">{"<"}</button>
        <button className="gallery-button next">{">"}</button>
      </div>
    </div>
  );
}

export default Gallery;