"use strict";
const loadingCircle = document.querySelector(".loadingCircle");

const getPokemonImg = async () => {
  try {
    const pokemonName = document
      .querySelector(".pokemonName")
      .value.toLowerCase()
      .trim();

    console.time("Fetching Images took");
    loadingCircle.classList.toggle("hide");
    const fetch_response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    loadingCircle.classList.toggle("hide");

    console.timeEnd("Fetching Images took");

    if (!fetch_response.ok) {
      throw new Error("Fetching is unsuccessful");
    }
    document.querySelector(".centerBlock").innerHTML = "";
    const data = await fetch_response.json();
    let pokiSprites = [];

    for (const [key, value] of Object.entries(data.sprites)) {
      if (typeof value === "string") {
        pokiSprites.push(value);
      }
    }

    for (const sprite of pokiSprites) {
      let img = document.createElement("img");
      img.alt = "pokemon";
      img.src = sprite;
      img.onload = function () {
        document.querySelector(".centerBlock").appendChild(img);
      };
    }
  } catch (error) {
    console.error(error);
  }
};

//getting pokemon names
let all_pokemons = [];
fetch("pokemons_name.json")
  .then((response) => response.json())
  .then((data) => all_pokemons.push(...data.map((name) => name.toLowerCase())));

const suggestions = document.querySelector(".suggestions");
const pokemonName = document.querySelector(".pokemonName");

function matchWord(words_arr, wordToMatch) {
  return words_arr.filter((word) => {
    //gi - global insensitive
    const regex = new RegExp(wordToMatch, "gi");
    return word.match(regex);
  });
}

//Adds all pokemon suggestions into the ul list
pokemonName.addEventListener("keyup", () => {
  let wordHint = document
    .querySelector(".pokemonName")
    .value.toLowerCase()
    .trim();

  suggestions.innerHTML = matchWord(all_pokemons, wordHint)
    .map((name, index) => {
      //Highlight for typed letters
      name = name.replace(wordHint, `<span class="hl">${wordHint}</span>`);
      //TabIndex + 1 cuz tabIndex = 1 is website's url
      return `<li class="suggested" tabindex="${index + 1}">${name}</li>`;
    })
    .join("");
});

//Makes you able to choose a wanted pokemon-name from a suggested-list by clicking at it
pokemonName.addEventListener("keyup", () => {
  const suggested = document.querySelectorAll(".suggested");
  suggested.forEach((suggestion) => {
    suggestion.addEventListener("click", () => {
      pokemonName.value = suggestion.textContent;
      suggestions.innerHTML = "";
      getPokemonImg();
    });
  });
});

//Logic for getting wanted Pokemon when using TabIndex & Enter
pokemonName.addEventListener("keyup", () => {
  const suggested = document.querySelectorAll(".suggested");
  suggested.forEach((suggestion) => {
    // suggestion === pokemon name hints
    suggestion.addEventListener("focus", () => {
      suggestion.addEventListener("keyup", (e) => {
        //keyCode 13 belongs to enter
        if (e.key === "Enter") {
          pokemonName.value = suggestion.textContent;
          suggestions.innerHTML = "";
          getPokemonImg();
        }
      });
    });
  });
});

//Logic for Random Pokemon button
let randomInt;
function getRandomPokemon() {
  //Index of pokemon from 0 to length of the list -1
  randomInt = Math.floor(Math.random() * all_pokemons.length);

  pokemonName.value = all_pokemons[randomInt];
  suggestions.innerHTML = "";
  getPokemonImg();
}

//Making website dynamic
let translation;
let translatedX;
function setTranslation() {
  if (window.innerWidth > 1310) {
    translation = 1000;
  } else if (window.innerWidth > 940 && window.innerWidth < 1310) {
    translation = 700;
  } else if (window.innerWidth > 710 && window.innerWidth < 940) {
    translation = 500;
  } else if (window.innerWidth > 400 && window.innerWidth < 710) {
    translation = 400;
  } else {
    translation = 300;
  }
  translatedX = 0;
}

setTranslation();
window.addEventListener("resize", setTranslation);

//Next Image Button
function nextPic() {
  const pokemonImgs = Array.from(
    document.querySelector(".centerBlock").children
  );
  translatedX -= translation;

  if (
    translatedX === pokemonImgs.length * -translation ||
    translatedX < pokemonImgs.length * -translation
  ) {
    translatedX = 0;
  }

  pokemonImgs.forEach((chr) => {
    chr.style.transform = `translateX(${translatedX}px)`;
  });
}

//Previous Image Button
function prevPic() {
  const pokemonImgs = Array.from(
    document.querySelector(".centerBlock").children
  );
  translatedX += translation;

  if (translatedX > 0) {
    translatedX = translation * -(pokemonImgs.length - 1);
  }
  pokemonImgs.forEach((chr) => {
    chr.style.transform = `translateX(${translatedX}px)`;
  });
}

//auto-image-switch + logic for manual switch
let intervalId = setInterval(nextPic, 2000);
const nextBtn = document.querySelector(".nextBtn");
nextBtn.addEventListener("click", () => {
  nextPic();
  clearInterval(intervalId);
  intervalId = setInterval(nextPic, 2000);
});

const prevBtn = document.querySelector(".prevBtn");
prevBtn.addEventListener("click", () => {
  prevPic();
  clearInterval(intervalId);

  intervalId = setInterval(nextPic, 2000);
});
