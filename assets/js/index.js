const container = document.querySelector('#container');
const regionTitle = document.querySelector('#region-title');

let pageOrGeneration = 1;

// renderizza la lista dei pokemon, al primo avvio con i 151 pokemon della prima generazione
renderList();



// prende dati api
async function fetchData(url) {
  const resp = await fetch(url);
  const data = await resp.json();
  return data;
}

// renderizza la lista di pokemon
async function renderPokemonList(list) {
  let listOfPokemon = '';
  const pokemonDataPromises = list.map(pokemonData => fetchData(pokemonData.url));
  const pokemonDataList = await Promise.all(pokemonDataPromises);
  const sortedPokemonDataList = pokemonDataList.sort((a, b) => a.id - b.id);

  sortedPokemonDataList.forEach((pokemon) => {
    listOfPokemon += renderCards(pokemon);
  });


  renderGenerationTitle();
  container.innerHTML = listOfPokemon;

  const prevButton = document.querySelector('#prevButton');
  const nextButton = document.querySelector('#nextButton');


  if (pageOrGeneration === 1) {
    prevButton.style.visibility = 'hidden';
  }

  if (pageOrGeneration === 9) {
    nextButton.style.visibility = 'hidden';
  }

  prevButton.addEventListener('click', () => {
    if (pageOrGeneration > 1) {
      pageOrGeneration--;
      renderList();
    }

  })

  nextButton.addEventListener('click', () => {
    if (pageOrGeneration < 9) {
      pageOrGeneration++;
      renderList();
    }
  });

}

// render di una carta della lista generale
function renderCards(pokemon) {
  const imgUrl = pokemon.sprites.front_default;
  const pokemonID = (pokemon.id).toString().padStart(3, '0'); //numero del pokemon con sempre minimo tre cifre
  const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
  const pokemonType = pokemon.types[0].type.name;
  const cardColor = selectCardColor(pokemonType);
  const card = `      <div class="card"  id=${pokemon.id} style='background-color: ${cardColor}'>
   <img src="${imgUrl}" alt="">
   <div class="pokemon-name title">${pokemonName}</div>
   <div class="pokemon-number">${pokemonID}</div>
 </div>`;
  return card;
}


// renderizza la lista di ricerca per generazione
async function renderList() {
  const gen = numberPokemonForGeneration(pageOrGeneration);
  const listOfPokemon = await fetchData(`https://pokeapi.co/api/v2/pokemon?limit=${gen.limit}&offset=${gen.offset}`);
  await renderPokemonList(listOfPokemon.results);
  const cards = document.querySelectorAll('.card');
  //event listener per dattaglio carte
  cards.forEach((card) => {
    card.addEventListener('click', async () => {
      const pokemon = await pokemonSelected(card);
      console.log(pokemon)
    })
  })

}

// data singolo pokemon
async function pokemonSelected(pokemonData) {
  console.log(pokemonData)
  const pokemonSelected = await fetchData(`https://pokeapi.co/api/v2/pokemon/${pokemonData.id}`);
  renderModal(pokemonSelected);
  return pokemonSelected;
}


//background card color
function selectCardColor(type) {
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


  let color = colours[type] || '#FFF';

  return color;
}

// regioni pokemon in base a generazione/pagina
function pokemonRegion(genNumber) {
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
function numberPokemonForGeneration(genNumber) {
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

// render sezione titolo e generazione
function renderGenerationTitle() {
  regionTitle.innerHTML = `<button id="prevButton">&lt;</button>
  <div>
  <h2>${pokemonRegion(pageOrGeneration)}</h2>
  <h3>Gen ${pageOrGeneration}</h3>
  </div>
  <button id="nextButton">&gt;</button>`
}


// ricerca pokemon per nome o Id
const form = document.querySelector('#search-pokemon');
const inputString = document.querySelector('#search-pokemon-input');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const inputStringValue = inputString.value;
  await searchPokemon(inputStringValue);
})

async function searchPokemon(pokemon) {
  try {
    const pokemonList = await fetchData('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1010');
    const filteredList = pokemonList.results.filter(item => {
      if (!isNaN(pokemon)) {
        return item.url.includes(`/${parseInt(pokemon)}`);
      } else {
        return item.name.startsWith(pokemon.toLowerCase());
      }
    });
    if (filteredList.length === 0) {
      throw new Error('Sorry, this Pokemon doesn\'t exist or isn\'t in our database.');
    }

    const pokemonSearchedPromises = filteredList.map(async item => await fetchData(item.url));
    const pokemonSearched = await Promise.all(pokemonSearchedPromises);

    const cards = pokemonSearched.map(pokemon => renderCards(pokemon)).join('');
    regionTitle.innerHTML = `<h2>Results for ${pokemon}</h2>`;
    container.innerHTML = cards;
    return filteredList;
  } catch (err) {
    if (pokemon) {
      document.querySelector('#region-title').innerHTML = '<div id=\'error-message\'>Sorry, this Pokemon doesn\'t exist or isn\'t in our database.</div>';
      container.innerHTML = '';
    } else {
      renderGenerationTitle();
      renderList();
    }
  }
}




let timeoutId;

form.addEventListener('keyup', () => {
  clearTimeout(timeoutId); // cancella il timeout precedente

  if (inputString.value.length === 0) {
    renderGenerationTitle();
    renderList();
  } else if (inputString.value.length >= 1) {
    //il timeout serve a evitare la chiamata immediata all'api, ma si attiva solo quando l'utente smette di digitare per almeno mezzo secondo
    // Imposta un nuovo timeout per la funzione di ricerca
    timeoutId = setTimeout(() => {
      searchPokemon(inputString.value);
    }, 500); // Imposta il ritardo a 500 millisecondi (0,5 secondi)
  }
});


async function renderModal(pokemon){
  console.log(pokemon);
  const pokemonDescription = await fetchData(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`)
  console.log(pokemonDescription);
  const pokemonModal = document.querySelector('#pokemon-detail-modal');
  console.log(pokemon.types[0].type.name)
  
  pokemonModal.style.display = 'flex';
  let elem = `      <div id="modal-content" >
  <button id="close-pokemon-detail">&lt;</button>
  <h3>${pokemon.forms[0].name}</h3>
  <h4>${pokemon.id}</h4>
  <picture style='background-color:${selectCardColor(pokemon.types[0].type.name)}'>
    <img src="${pokemon.sprites.front_default}" alt="">
  </picture>
  <div id="type-of-detail">
    <div>Description</div>
    <div>Types</div>
    <div>Stats</div>
  </div>
  <div id="detail-content">
    ${pokemonDescription.flavor_text_entries[17].flavor_text}
  </div>
</div>`;
console.log(elem)
pokemonModal.innerHTML = elem;

const closeModal = document.querySelector('#close-pokemon-detail');
closeModal.addEventListener('click', () =>{
  pokemonModal.style.display = 'none';
})
}