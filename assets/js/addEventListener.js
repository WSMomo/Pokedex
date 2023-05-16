import { pokemonSelectedAPI } from "./api.js";
import { renderModal } from "./render.js";
export function cardClick(){
  const cards = document.querySelectorAll('.card');
  //event listener per dattaglio carte
  cards.forEach((card) => {
    card.addEventListener('click', async () => {
      const pokemon = await pokemonSelectedAPI(card);
      renderModal(pokemon)
    })
  })
}
