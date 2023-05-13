const container = document.querySelector('#container');

renderList();



// prende dati api
async function fetchData(url) {
  const resp = await fetch(url);
  const data = await resp.json();
  console.log(data);
  return data;
}

// renderizza la lista di pokemon
async function renderPokemonList(list) {
  console.log(list);
  console.log(list[5].name)
  let listOfPokemon = '';
  list.forEach((pokemon, index) => {
    const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`;  
    const pokemonIndex = (index+1).toString().padStart(3, '0'); //numero del pokemon con sempre minimo tre cifre
    const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
    listOfPokemon += `      <div class="card"  id=${index+1}>
     <img src="${imgUrl}" alt="">
     <div class="pokemon-name title">${pokemonName}</div>
     <div class="pokemon-number">${pokemonIndex}</div>
   </div>`;
  })
  container.innerHTML = listOfPokemon;
}

async function renderList(){
  const listOfPokemon = await fetchData('https://pokeapi.co/api/v2/pokemon?limit=151');
  await renderPokemonList(listOfPokemon.results);

  const cards = document.querySelectorAll('.card');
 //event listener per dattaglio carte
 cards.forEach((card) => {
   card.addEventListener('click', async (event) => {
    console.log(card.id)
     const pokemonSelected = await fetchData(`https://pokeapi.co/api/v2/pokemon/${card.id}`);  
   })
 })

}

