import { pokemonSelectedAPI } from "./api.js";

//background card color
export function selectCardColor(type) {
  const colours = {
    normal: '#A8A8A880',
    fire: '#E5755A80',
    water: '#4F94C480',
    electric: '#F9D95880',
    grass: '#75C37580',
    ice: '#B3E6E380',
    fighting: '#C08D7780',
    poison: '#A981C380',
    ground: '#C4A77D80',
    flying: '#A8B0E680',
    psychic: '#F27AA180',
    bug: '#B8D04B80',
    rock: '#CAB66C80',
    ghost: '#7B62A380',
    dragon: '#8B53E580',
    dark: '#8E735B80',
    steel: '#C6C6D780',
    fairy: '#F6B4D180',
  };


  let color = colours[type.toLowerCase()] || '#FFF';

  return color;
}

// regioni pokemon in base a generazione/pagina
export function pokemonRegion(genNumber) {
  const regions = {
    1: "Kanto",
    2: "Johto",
    3: "Hoenn",
    4: "Sinnoh",
    5: "Unova",
    6: "Kalos",
    7: "Alola",
    8: "Galar",
    9: "Paldea"
  };

  return regions[genNumber];
}

// in base al numero della generazione restituisce l'offset e il limit in base al numero di pokemon
export function numberPokemonForGeneration(genNumber) {
  const pokemonForGeneration = {
    0: 0,
    1: 151,
    2: 100,
    3: 135,
    4: 107,
    5: 156,
    6: 72,
    7: 88,
    8: 96,
    9: 105
  }
  let offset = 0;

  for (let i = 0; i < genNumber; i++) {
    offset += pokemonForGeneration[i];
  }

  const limit = pokemonForGeneration[genNumber]
  return { offset: offset, limit: limit };
}
export function filterPokemon(pokemon, pokemonList) {
  return pokemonList.filter((item) => {
    if (!isNaN(pokemon)) {
      let newItem = pokemon.toString().replaceAll('0', '');
      return item.url.includes(newItem);
    } else {
      return item.name.startsWith(pokemon.toLowerCase());
    }
  });
}

// prima lettera maiuscola di una stringa
export function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// le stringhe di pokeApi spesso contengono \f che crea problemi di visualizzazione, quindi questa funzione lo rimpiazza con \n
export function changeNewLineText(string) {
    return string.replace('\f', '\n');
}