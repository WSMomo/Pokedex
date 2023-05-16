import { fetchData, pokemonSelectedAPI, listOfPokemonAPI, fetchAllPokemonListAPI, fetchSearchedPokemonAPI } from "./api.js";
import { renderCards, renderGenerationTitle, renderHidePrevNextButton, renderModal, renderCardsSearched, renderSearchedPokemonTitle, renderErroreMessage } from "./render.js";
import { numberPokemonForGeneration, filterPokemon } from "./function.js";
import { container, regionTitle, form, inputString } from "./globals.js";

let pageOrGeneration = 1;

// renderizza la lista dei pokemon, al primo avvio con i 151 pokemon della prima generazione
renderList();


// renderizza la lista di pokemon
async function renderPokemonList(list) {
  const pokemonDataPromises = list.map(pokemonData => fetchData(pokemonData.url));
  const pokemonDataList = await Promise.all(pokemonDataPromises);
  const sortedPokemonDataList = pokemonDataList.sort((a, b) => a.id - b.id);
  const arrayPokemonCards = sortedPokemonDataList.map(pokemon => renderCards(pokemon));

  regionTitle.innerHTML = renderGenerationTitle(pageOrGeneration);
  container.innerHTML = arrayPokemonCards.join(' ');

  const prevButton = document.querySelector('#prevButton');
  const nextButton = document.querySelector('#nextButton');

  renderHidePrevNextButton(pageOrGeneration, prevButton, nextButton);

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




// renderizza la lista di ricerca per generazione
async function renderList() {
  const gen = numberPokemonForGeneration(pageOrGeneration);
  const listOfPokemon = await listOfPokemonAPI(gen);
  await renderPokemonList(listOfPokemon.results);
  const cards = document.querySelectorAll('.card');
  //event listener per dattaglio carte
  cards.forEach((card) => {
    card.addEventListener('click', async () => {
      const pokemon = await pokemonSelectedAPI(card);
      renderModal(pokemon)
      console.log(pokemon)
    })
  })

}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const inputStringValue = inputString.value;
  await searchPokemon(inputStringValue);
})

async function searchPokemon(pokemon) {
  try {
    const pokemonList = await fetchAllPokemonListAPI();
    const filteredList = filterPokemon(pokemon, pokemonList);
    if (filteredList.length === 0) {
      throw new Error('Sorry, this Pokemon doesn\'t exist or isn\'t in our database.');
    }
    const pokemonSearched = await fetchSearchedPokemonAPI(filteredList);
    regionTitle.innerHTML = renderSearchedPokemonTitle(pokemon);
    container.innerHTML = renderCardsSearched(pokemonSearched);
  } catch (err) {
    if (pokemon) {
      document.querySelector('#region-title').innerHTML = renderErroreMessage();
      container.innerHTML = '';
    } else {
      regionTitle.innerHTML = renderGenerationTitle(pageOrGeneration);
      renderList();
    }
  }
}




let timeoutId;

form.addEventListener('keyup', () => {
  clearTimeout(timeoutId); // cancella il timeout precedente

  if (inputString.value.length === 0) {
    regionTitle.innerHTML = renderGenerationTitle(pageOrGeneration);
    renderList();
  } else if (inputString.value.length >= 1) {
    //il timeout serve a evitare la chiamata immediata all'api, ma si attiva solo quando l'utente smette di digitare per almeno mezzo secondo
    // Imposta un nuovo timeout per la funzione di ricerca
    timeoutId = setTimeout(() => {
      searchPokemon(inputString.value);
    }, 500); // Imposta il ritardo a 500 millisecondi (0,5 secondi)
  }
});


