import { selectCardColor, pokemonRegion } from "./function.js";
import { pokemonDescriptionAPI } from "./api.js";

 function renderModalMainContent(pokemon, pokemonDescription) {
  const pokemonName = pokemon.forms[0].name;
  const pokemonId = pokemon.id;
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

 function renderModalStats(pokemon){
  const hp = pokemon.stats[0].base_stat;
  const attack = pokemon.stats[1].base_stat;
  const defense = pokemon.stats[2].base_stat;
  const specialAttack = pokemon.stats[3].base_stat;
  const specialDefense = pokemon.stats[4].base_stat;
  const speed = pokemon.stats[5].base_stat;
  const total = hp + attack + defense + specialAttack + specialDefense + speed;

  const elem = `
  <ul>
    <li class='modal-li'>HP: ${hp}</li>
    <li class='modal-li'>Attack: ${attack}</li>
    <li class='modal-li'>Defense: ${defense}</li>
    <li class='modal-li'>Special Attack : ${specialAttack}</li>
    <li class='modal-li'>Special Defense: ${specialDefense}</li>
    <li class='modal-li'>Speed: ${speed}</li>
    <li class='modal-li'>Total: ${total}</li>
  </ul>
`;
  return elem;
}

 async function renderModalDescription(pokemonDescription){
  const elem = `${pokemonDescription.flavor_text_entries[17].flavor_text}`;
  return elem;
}

 function renderModalTypes(pokemon){
  const pokemonType1 = pokemon.types[0].type.name;
  const pokemonType2 = pokemon.types[1] ? pokemon.types[1].type.name : '';
  const elem = `
    <ul>
      <li class='modal-li' style='background-color:${selectCardColor(pokemonType1)}'>${pokemonType1}</li>
      ${pokemonType2 ? `<li class='modal-li' style='background-color:${selectCardColor(pokemonType2)}'>${pokemonType2}</li>` : ''}
    </ul>
  `;
  return elem;
}

// render di una carta della lista generale
export function renderCards(pokemon) {
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

export function renderHidePrevNextButton(pageOrGeneration, prevButton, nextButton) {
  if (pageOrGeneration === 1) {
    prevButton.style.visibility = 'hidden';
  }

  if (pageOrGeneration === 9) {
    nextButton.style.visibility = 'hidden';
  }
}

export async function renderModal(pokemon) {
  const pokemonDescription = await renderModalDescription(await pokemonDescriptionAPI(pokemon));
  const pokemonModal = document.querySelector('#pokemon-detail-modal');
  pokemonModal.style.display = 'flex';
  pokemonModal.innerHTML = renderModalMainContent(pokemon, pokemonDescription);

  const closeModal = document.querySelector('#close-pokemon-detail');
  closeModal.addEventListener('click', () => {
    pokemonModal.style.display = 'none';
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

export function renderSearchedPokemonTitle(pokemon){
  return `<h2>Results for ${pokemon}</h2>`;
}

export function renderCardsSearched(pokemon, pokemonSearched){
  const cards = pokemonSearched.map(pokemon => renderCards(pokemon)).join('');
  return cards;
}

export function renderErroreMessage(){
  return '<div id=\'error-message\'>Sorry, this Pokemon doesn\'t exist or isn\'t in our database.</div>';
}
