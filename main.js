const getPokemonImg = async () => {
  try {
    const pokemonName = document
      .querySelector(".pokemonName")
      .value.toLowerCase()
      .trim();

    const fetch_response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    if (!fetch_response.ok) {
      throw new Error("Fetching is unsuccessful");
    }
    const pokemonImg = document.querySelector(".pokemoneImg");
    const data = await fetch_response.json();
    pokemonImg.src = data.sprites.front_default;
  } catch (error) {
    console.error(error);
  }
};

let all_pokemons = [];
fetch("pokemons_name.json")
  .then((response) => response.json())
  .then((data) => all_pokemons.push(...data));

all_pokemons = all_pokemons.map((name) => name.toLowerCase());
const suggestions = document.querySelector(".suggestions");
const pokemonName = document.querySelector(".pokemonName");

function matchWord(words_arr, wordToMatch) {
  return words_arr.filter((word) => {
    const regex = new RegExp(wordToMatch, "gi");
    return word.match(regex);
  });
}
let hintedWords;
pokemonName.addEventListener("keydown", () => {
  let wordHint = document
    .querySelector(".pokemonName")
    .value.toLowerCase()
    .trim();
  suggestions.innerHTML = "";
  hintedWords = matchWord(all_pokemons, wordHint).map((element, index) => {
    return `<li class="hl" tabindex="${index}">${element}</li>`;
  });
  for (let i = 0; i < hintedWords.length; i++) {
    if (i < 15) {
      suggestions.innerHTML += hintedWords[i];
    }
  }
});

pokemonName.addEventListener("focusout", () => {
  suggestions.innerHTML = "";
  getPokemonImg();
});

//TODO

//still there a few issues, first can't choose anything using tab
//only 1 photo + no slider
//animation on hints, change image etc
//need highlight on chosen letters
//write some comments explaining chunks of code
//make code as clean as possible
