import React, { useState } from 'react';
import './Gallery.scss';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

let IMG_HOME_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
let TYPE_HOME_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/";

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonTypeMap {
  name: string;
  pokemon: any[];
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
  typeMap: PokemonTypeMap[];
}

function Gallery({list, typeMap} : PokedexProps) {
  const pokemonList: Pokemon[] = list;
  const pokemonTypeMap: PokemonTypeMap[] = typeMap;
  const [searchTerm, setTerm] = useState("");
  const [sortMode, setSortMode] = useState("dex-asc");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [currSection, setCurrSection] = useState(0);
  const pokemonSections: Pokemon[][] = [];

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

  const filteredPokemon = pokemonList.filter((p) => {
    const nameMatch =
      p.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      getDexNum(p).toString().startsWith(searchTerm);

    if (selectedTypes.length === 0) {
      return nameMatch;
    }

    const pokemonTypes = pokemonTypeMap
      .filter((typeGroup) => typeGroup.pokemon.some((poke) => poke.pokemon.name === p.name))
      .map((t) => t.name);

    const typeMatch = selectedTypes.every((t) => pokemonTypes.includes(t));

    return nameMatch && typeMatch;
  });

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

  for (let i = 0; i < sortedPokemon.length; i += 9) {
    pokemonSections.push(sortedPokemon.slice(i, i + 9));
  }

  return (
    <div id='gallery'>
      <div id='filters'>
        <TextField
          className='search-bar'
          label="Search for Pokemon"
          type="search"
          variant="filled"
          value={searchTerm}
          onChange={(e) => setTerm(e.target.value)}
        />
        <div id='sort-by'>
          <FormControl id="button-group">
            <RadioGroup
              id='radio-group'
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
        <div id='typeFilters'>
          <Button
            id='clear-button' 
            variant="outlined" 
            startIcon={<DeleteIcon />}
            onClick={() => setSelectedTypes([])}
          >
            Reset
          </Button>
          <FormControl className='type-control'>
            <InputLabel 
              className="type-label"
            >
              Select Types
            </InputLabel>
            <Select
              className='select-type'
              multiple
              value={selectedTypes}
              onChange={handleChange}
              input={<OutlinedInput label="Select Types" />}
              renderValue={(selected) => (
                <Box className="type-box">
                  {selected.map((type) => (
                    <Chip key={type} label={type} />
                  ))}
                </Box>
              )}
            >
              {pokemonTypes.map((type) => (
                <MenuItem
                  key={type.id}
                  value={type.name}
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
        <div className='grid-container'>
          <div className='poke-grid'>
            {pokemonSections[currSection]?.map((pokemon) => (
              <Card
                className='poke-card'
                key={pokemon.name}
              >
                <CardMedia
                  component="img"
                  className='poke-img'
                  image={`${IMG_HOME_URL}${parseInt(getDexNum(pokemon))}.png`}
                  title={pokemon.name}
                />
                <CardContent>
                  <Typography gutterBottom className='poke-label'>
                    {pokemon.name.toUpperCase()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Link className='card-button' to={`/details/${getDexNum(pokemon)}/`}>
                    <Button 
                      size="small"
                    >
                      View Details
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            ))}
          </div>
        </div>
        {pokemonSections.length > 1 && <>
          <button 
            className="gallery-button prev"
            onClick={() => setCurrSection((prev) => Math.max(prev - 1, 0))}
            disabled={currSection === 0}
          >
            {"<"}
          </button>
          <button 
            className="gallery-button next"
            onClick={() =>
              setCurrSection((prev) => Math.min(prev + 1, pokemonSections.length - 1))
            }
            disabled={currSection === pokemonSections.length - 1}
          >
            {">"}
          </button>
        </>}
      </div>
    </div>
  );
}

export default Gallery;