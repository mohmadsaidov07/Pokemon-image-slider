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
  .then((data) => all_pokemons.push(...data.map((name) => name.toLowerCase())));

const suggestions = document.querySelector(".suggestions");
const pokemonName = document.querySelector(".pokemonName");

function matchWord(words_arr, wordToMatch) {
  return words_arr.filter((word) => {
    const regex = new RegExp(wordToMatch, "gi");
    return word.match(regex);
  });
}

pokemonName.addEventListener("keyup", () => {
  let wordHint = document
    .querySelector(".pokemonName")
    .value.toLowerCase()
    .trim();

  suggestions.innerHTML = matchWord(all_pokemons, wordHint)
    .map((name, index) => {
      name = name.replace(wordHint, `<span class="hl">${wordHint}</span>`);
      return `<li class="suggested" tabindex="${index}">${name}</li>`;
    })
    .join("");
});

pokemonName.addEventListener("focusout", () => {
  pokemonName.value = suggestions.firstChild.textContent;
  suggestions.innerHTML = "";
  getPokemonImg();
});

//TODO
//Wrote a lot, but still need better understanding of what's going on
//still there a few issues, first can't choose anything using tab
//add arr of src's and ability to slide
//make slider look somehow liek apple's slider
//it'll switch on next pic after certain time
//but if u switch manually it'll reset the timer
//animation on hints, change image etc
//write some comments explaining chunks of code
//make code as clean as possible
//Make website dynamic, so phone users can use it as well
//gotta remove t9 from input and handle tabindex better
