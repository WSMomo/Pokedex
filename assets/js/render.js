import { selectCardColor, pokemonRegion, capitalizeFirst, changeNewLineText } from "./function.js";
import { pokemonDescriptionAPI } from "./api.js";

// renderizza il contenuto principale del modale con il dettaglio dei pokemon
function renderModalMainContent(pokemon, pokemonDescription) {
  const pokemonName = capitalizeFirst(pokemon.forms[0].name);
  const pokemonId = pokemon.id.toString().padStart(3, '0');
  const pokemonType = pokemon.types[0].type.name;
  const pokemonImgUrl = pokemon.sprites.front_default;
  let elem = `
  <div id="modal-content" >
  <button id="close-pokemon-detail">X</button>
  <h3>${pokemonName}</h3>
  <h4>${pokemonId}</h4>
  <picture style='background-color:${selectCardColor(pokemonType)}'>
    <img src="${pokemonImgUrl}" alt="${pokemonName}">
  </picture>
  <ul id="type-of-detail">
    <li id='description-modal' class='item-modal'>Description</li>
    <li id='types-modal' class='item-modal'>Types</li>
    <li id='stats-modal' class='item-modal'>Stats</li>
  </ul>
  <div id="detail-content">
  ${pokemonDescription}
  </div>
</div>`;
  return elem;
}

// renderizza le stats del modale
function renderModalStats(pokemon) {
  const hp = pokemon.stats[0].base_stat;
  const attack = pokemon.stats[1].base_stat;
  const defense = pokemon.stats[2].base_stat;
  const specialAttack = pokemon.stats[3].base_stat;
  const specialDefense = pokemon.stats[4].base_stat;
  const speed = pokemon.stats[5].base_stat;
  const total = hp + attack + defense + specialAttack + specialDefense + speed;

  const elem = `
  <ul>
    <li class='modal-li'><div>HP:</div><div class='pokemon-stat'>${hp}</div></li>
    <li class='modal-li'><div>Attack:</div><div class='pokemon-stat'>${attack}</div></li>
    <li class='modal-li'><div>Defense:</div><div class='pokemon-stat'>${defense}</div></li>
    <li class='modal-li'><div>Special Attack:</div><div class='pokemon-stat'>${specialAttack}</div></li>
    <li class='modal-li'><div>Special Defense:</div><div class='pokemon-stat'>${specialDefense}</div></li>
    <li class='modal-li'><div>Speed:</div><div class='pokemon-stat'>${speed}</div></li>
    <li class='modal-li'><div>Total:</div><div class='pokemon-stat'>${total}</div></li>
  </ul>
`;

  return elem;
}

// renderizza la descrizione del pokemon
async function renderModalDescription(pokemonDescription) {
  // siccome le descrizioni delle api di pokeApi non sono ordinate per lingua, filtra e restituisce la prima descrizione in inglese
  let hasDescription = false;
  for (let i = 0; i < pokemonDescription.flavor_text_entries.length; i++) {
    if (pokemonDescription.flavor_text_entries[i].language.name === 'en') {
      hasDescription = true;
      return changeNewLineText(pokemonDescription.flavor_text_entries[i].flavor_text);
    }
  }

  // se non ci sono descrizioni o se non c'è in inglese restituisce
  if (pokemonDescription.flavor_text_entries.length === 0 || !hasDescription) {
    return 'No description available';
  }
}


// renderizza i tipi del pokemon
function renderModalTypes(pokemon) {
  const pokemonType1 = capitalizeFirst(pokemon.types[0].type.name);
  const pokemonType2 = pokemon.types[1] ? capitalizeFirst(pokemon.types[1].type.name) : '';
  const elem = `
    <ul>
      <li class='modal-li pokemon-type' style='background-color:${selectCardColor(pokemonType1)}'>${pokemonType1}</li>
      ${pokemonType2 ? `<li class='modal-li pokemon-type' style='background-color:${selectCardColor(pokemonType2)}'>${pokemonType2}</li>` : ''}
    </ul>
  `;
  return elem;
}

// render di una carta della lista generale
export function renderCards(pokemon) {
  const imgUrl = pokemon.sprites.front_default;
  const pokemonID = (pokemon.id).toString().padStart(3, '0'); //numero del pokemon con sempre minimo tre cifre
  const pokemonName = capitalizeFirst(pokemon.name);
  const pokemonType = pokemon.types[0].type.name;
  const cardColor = selectCardColor(pokemonType);
  const card = `      <div class="card"  id=${pokemon.id} style='background-color: ${cardColor}'>
   <img src="${imgUrl}" alt="">
   <div class="pokemon-name title">${pokemonName}</div>
   <div class="pokemon-number">${pokemonID}</div>
 </div>`;
  return card;
}

// render sezione titolo e generazione
export function renderGenerationTitle(pageOrGeneration) {
  const elem = `<button id="prevButton">&lt;</button>
  <div>
  <h2>${pokemonRegion(pageOrGeneration)}</h2>
  <h3>Gen ${pageOrGeneration}</h3>
  </div>
  <button id="nextButton">&gt;</button>`;
  return elem;
}

// renderizza o nasconde i button di avanzamento tra una pagina e l'altra
export function renderHidePrevNextButton(pageOrGeneration, prevButton, nextButton) {
  if (pageOrGeneration === 1) {
    prevButton.style.visibility = 'hidden';
  }

  if (pageOrGeneration === 9) {
    nextButton.style.visibility = 'hidden';
  }
}

// renderizza il modale e il suo stile, aggiunge addEventListener all'interno del modale per cambiare sezione da guardare o per la chiusura
export async function renderModal(pokemon) {
  const pokemonDescription = await renderModalDescription(await pokemonDescriptionAPI(pokemon));
  const pokemonModal = document.querySelector('#pokemon-detail-modal');
  pokemonModal.style.display = 'flex';
  pokemonModal.innerHTML = renderModalMainContent(pokemon, pokemonDescription);

  const closeModal = document.querySelector('#close-pokemon-detail');
  closeModal.addEventListener('click', () => {
    pokemonModal.style.display = 'none';
  })

  document.addEventListener('keydown', (event) => {
    if(event.key === 'Escape'){
      pokemonModal.style.display = 'none';
    }
  })

  const descriptionModal = document.querySelector('#description-modal');
  const typesModal = document.querySelector('#types-modal');
  const statsModal = document.querySelector('#stats-modal');
  const detailContent = document.querySelector('#detail-content');
  descriptionModal.addEventListener('click', () => {
    detailContent.innerHTML = pokemonDescription;
  });

  typesModal.addEventListener('click', () => {
    detailContent.innerHTML = renderModalTypes(pokemon);
  });

  statsModal.addEventListener('click', () => {
    detailContent.innerHTML = renderModalStats(pokemon)
  });
}

// renderizza l'input utente del pokemon cercato
export function renderSearchedPokemonTitle(pokemon) {
  return `<h2>Results for ${pokemon}</h2>`;
}

// renderizza l'insieme di carte che figurano nella ricerca utente
export function renderCardsSearched(pokemonSearched) {
  const cards = pokemonSearched.map(pokemon => renderCards(pokemon));
  return cards;
}

// renderizza il messaggio di errore in caso non si trovi il pokemon
export function renderErroreMessage() {
  return '<div id=\'error-message\'>Sorry, this Pokemon doesn\'t exist or isn\'t in our database.</div>';
}
