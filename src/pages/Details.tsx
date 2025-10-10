import React, { useEffect, useState } from 'react';
import './Details.scss';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

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

let API_HOME_URL = "https://pokeapi.co/api/v2/pokemon/";
let TYPE_HOME_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/";
let IMG_HOME_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
let SHINY_HOME_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/"

function Details({list} : PokedexProps) {
    const pokemonList: Pokemon[] = list;
    const dexNum = useParams().dexNum;
    const [pokemon, setPokemon] = useState<any>(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getDexNum = (pokemon: Pokemon): string => {
        const findNum = pokemon.url.match(/\/pokemon\/(\d+)\//);

        if (findNum) {
            return `${findNum[1]}`;
        }

        return "0000";
    };

    const getPrevDexNum = (pokemon: any): string => {
        const currPokemon = pokemonList.find((p) => p.name === pokemon.name);
        
        if (!currPokemon) { return "1"; }

        const index = pokemonList.indexOf(currPokemon);

        const prevIndex = index > 0 ? index - 1 : 0;
        return getDexNum(pokemonList[prevIndex]);
    };

    const getNextDexNum = (pokemon: any): string => {
        const currPokemon = pokemonList.find((p) => p.name === pokemon.name);
        
        if (!currPokemon) { return "1"; }

        const index = pokemonList.indexOf(currPokemon);

        const nextIndex = index < pokemonList.length - 1 ? index + 1 : pokemonList.length - 1;
        return getDexNum(pokemonList[nextIndex]);
    };

    const getType = (typeName : string) : any => {
        const typePair = pokemonTypes.find(t => t.name === typeName);
        
        if (!typePair) { return 0; }

        return typePair.id;
    };

    useEffect(() => {
        let pokemonURL = `${API_HOME_URL}${dexNum}/`;

        axios.get(pokemonURL)
        .then((response) => {
            setPokemon(response.data)
        })
        .catch((error) => {
            setError(error)
        })
        .finally(() => {
            console.log("API Complete!");
            setLoading(false);
        });
    }, [dexNum]);

    if (loading) return <p>Loading Pokémon...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div id='details'>
            <div id='prev'>
                <Link to={`/details/${getPrevDexNum(pokemon)}/`}>
                    <button>{"<"}</button>
                </Link>
            </div>
            <div id='info'>
                <Card className='detail-card'>
                    <CardContent>
                        <Typography gutterBottom className='poke-label'>
                            #{pokemon.id}&nbsp;&nbsp;{pokemon.name.toUpperCase()}
                        </Typography>
                    </CardContent>
                    <CardMedia
                        component="img"
                        className='poke-img'
                        image={`${IMG_HOME_URL}${pokemon.id}.png`}
                        title={pokemon.name}
                    />
                    <CardContent className='mui-card-content'>
                        <div id='card-content'>
                            <div id='stats'>
                                {pokemon.stats.map((statObj: any) => (
                                    <p key={statObj.stat.name}>{statObj.stat.name.toUpperCase()}: {statObj.base_stat}</p>
                                ))}
                                <p>Base EXP: {pokemon.base_experience}&nbsp;&nbsp;&nbsp;&nbsp;Weight: {pokemon.weight}</p>
                            </div>
                            <div id='other-info'>
                                <div id='types-container'>
                                    <h4>Type(s)</h4>
                                    <div id='types'>
                                        {pokemon.types.map((typeObj : any) => (   
                                            <img
                                                key={typeObj.type.name}
                                                className='type-img' 
                                                src={`${TYPE_HOME_URL}${getType(typeObj.type.name)}.png`} 
                                                alt={typeObj.type.name}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 id='shiny-label'>Shiny Version</h4>
                                    <img id='shiny-img' src={`${SHINY_HOME_URL}${pokemon.id}.png`}  alt="No Shiny Version" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div id='next'>
                <Link to={`/details/${getNextDexNum(pokemon)}/`}>
                    <button>{">"}</button>
                </Link>
            </div>
        </div>
    );
}

export default Details;