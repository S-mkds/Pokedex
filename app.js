let allPokemon = [];
let tableauFin = [];
const searchInput = document.querySelector(".recherche-poke input");
const listePoke = document.querySelector(".liste-poke");
const chargement = document.querySelector(".loader")

//liste des couleurs selon le type du Pokemon
const types = {
    grass: "rgba( 120, 200, 80, 0.6 )",
	ground: "rgba( 226, 191, 101, 0.6 )", 
	dragon: "rgba( 111, 53, 252, 0.6 )",
	fire: "rgba( 245, 130, 113, 0.6 )",
	electric: "rgba( 247, 208, 44, 0.6 )",
	fairy: "rgba( 214, 133, 173, 0.6 )", 
	poison: "rgba( 150, 109, 163, 0.6 )",
	bug: "rgba( 179, 245, 148, 0.6 )",
	water: "rgba( 99, 144, 240, 0.6 )",
	normal: "rgba( 217, 213, 216, 0.6 )", 
	psychic: "rgba( 249, 85, 135, 0.6 )", 
	flying: "rgba( 169, 143, 243, 0.6 )", 
	fighting: "rgba( 194, 89, 86, 0.6 )", 
	rock: "rgba( 182, 161, 54, 0.6 )", 
	ghost: "rgba( 115, 87, 151, 0.6 )", 
	ice: "rgba( 150, 217, 214, 0.6 )", 
};


// fetch la liste des pokemons
function fetchPokemonBase() {
	fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
		.then((reponse) => reponse.json())
		.then((allPoke) => {
			// console.log(allPoke);
			allPoke.results.forEach((pokemon) => {
				fetchPokemonInfo(pokemon);
			});
		});
}
// fetch le detail de chaque pokemon
function fetchPokemonInfo(pokemon) {
	let objPokemonFull = {};
	let url = pokemon.url;
	let nameP = pokemon.name;
	fetch(url)
		.then((reponse) => reponse.json())
		.then((pokeData) => {
			objPokemonFull.pic = pokeData.sprites.front_default;
			objPokemonFull.type = pokeData.types[0].type.name;
			objPokemonFull.id = pokeData.id;
			// Fetch du nom en FR
			fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameP}`)
				.then((reponse) => reponse.json())
				.then((pokeData) => {
					objPokemonFull.name = pokeData.names[4].name;
					allPokemon.push(objPokemonFull);
					if (allPokemon.length == 151) {
						tableauFin = allPokemon
							.sort((a, b) => {
								return a.id - b.id;
							})
							//On slice pour n'afficher que 21 pokemons au départ
							.slice(0, 21);

						createCard(tableauFin);
                        chargement.style.display = "none";
					}
				});
		});
}

fetchPokemonBase();

// Creation Card
function createCard(arr) {
	for (let i = 0; i < arr.length; i++) {
		const carte = document.createElement("li");
		// Couleur de carte
		let couleur = types[arr[i].type];

		carte.style.background = couleur;
		// Nom Pokemon
		const txtCarte = document.createElement("h5");
		txtCarte.innerText = arr[i].name;
		// id Pokemon
		const idCarte = document.createElement("p");
		idCarte.innerText = `# ${arr[i].id} / 151`;
		// Img Pokemon
		const imgCarte = document.createElement("img");
		imgCarte.src = arr[i].pic;
        // Logo Type Pokemon
        const imgType = document.createElement('img');
        imgType.src = `/assets/logo/${arr[i].type}.png`
        imgType.className = "typeLogo"

		carte.appendChild(imgCarte);
		carte.appendChild(txtCarte);
		carte.appendChild(idCarte);
        carte.appendChild(imgType);

		listePoke.appendChild(carte);
	}
}

// Infinite scroll
window.addEventListener("scroll", () => {
	const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
	// scrollTop = Scroll depuis le top
	// scrollHeight = Scroll total
	// clientHeight = hauteur de la fenêtre (visible)

	if (clientHeight + scrollTop >= scrollHeight - 20) {
		addPoke(6);
	}
});

let index = 21;

function addPoke(nb) {
	if (index > 151) {
		return;
	}
	const arrToAdd = allPokemon.slice(index, index + nb);
	createCard(arrToAdd);
	index += nb;
}

// Recherche
searchInput.addEventListener("keyup", recherche);

function recherche() {
	if (index < 151) {
		addPoke(130);
	}

	let filter, allLi, titleValue, allTitles;

	filter = searchInput.value.toUpperCase();
	allLi = document.querySelectorAll("li");
	allTitles = document.querySelectorAll("li > h5");

	for (i = 0; i < allLi.length; i++) {
		titleValue = allTitles[i].innerText;
		// si la valeur de la recherche est le nom d'un pokemon display flex
		if (titleValue.toUpperCase().indexOf(filter) > -1) {
			allLi[i].style.display = "flex";
		} else {
			allLi[i].style.display = "none";
		}
	}
}

// Animation Input
searchInput.addEventListener("input", function (e) {
	if (e.target.value !== "") {
		e.target.parentNode.classList.add("active-input");
	} else if (e.target.value === "") {
		e.target.parentNode.classList.remove("active-input");
	}
});
