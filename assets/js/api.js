// prende dati api
export async function fetchData(url) {
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
}

// data singolo pokemon
export async function pokemonSelectedAPI(pokemonData) {
  const pokemonSelected = await fetchData(`https://pokeapi.co/api/v2/pokemon/${pokemonData.id}`);
  return pokemonSelected;
}


export async function listOfPokemonAPI(gen){
  return await fetchData(`https://pokeapi.co/api/v2/pokemon?limit=${gen.limit}&offset=${gen.offset}`);
}

export function pokemonDescriptionAPI (pokemon){
  return  fetchData(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`)
}

export async function fetchAllPokemonListAPI() {
  const pokemonList = await fetchData('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1010');
  return pokemonList.results;
}


export async function fetchSearchedPokemonAPI(filteredList) {
  const pokemonSearchedPromises = filteredList.map(async item => await fetchData(item.url));
  const pokemonSearched = await Promise.all(pokemonSearchedPromises);
  return pokemonSearched;
}