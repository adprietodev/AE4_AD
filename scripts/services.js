let namePokemons = [];

let dataPokemons = [];
let dataPokemonsDB = [];
let itemsSelected = []

let nextPage = "";
let previousPage = "";

/**
 * Metodo que utilizamos para coger los datos de la API de pokemon
 * @param {*} url le pasamos una url con una paginación para mostar la cantidad de pokemons que hay
 */
const getNamePokemon = (url) => {

    axios
        .get(url)
        .then(response => {
            //console.log(response.data.results);
            nextPage = response.data.next;
            previousPage = response.data.previous;
            if (nextPage === null) {
                nextPage = "https://pokeapi.co/api/v2/pokemon";
            }

            if (previousPage === null) {
                previousPage = "https://pokeapi.co/api/v2/pokemon?offset=1300&limit=20";
            }
            getInfoApi(response.data.results)
        })
        .catch(error => {
            console.log(error);
        })
}

/**
 * En este metodo lo llamamos cuando cogemos los datos para separar solo los nombre y posteriormente hacer otra llamada a la api
 * @param {*} objPokemon le pasamos el objeto con datos de la primera llamada
 */
const getInfoApi = (objPokemon) => {
    let tempArr = objPokemon;

    namePokemons = tempArr.map(item => item.name);
    getInfoPokemon();

}

/**
 * Metodo en el que despues de coger los nombres de los pokemons y almacenarlos llamamos de nuevo a la API para coger caracteristicas especiales.
 */
const getInfoPokemon = () => {

    namePokemons.map(name => {
        //console.log(name);
        let data = {
            id: 0,
            name: "",
            image: "",
            stats: [],
            types: [],
        }
        axios
            .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then(response => {
                data.id = parseInt(response.data.id);
                data.name = name;
                data.image = response.data.sprites.other.home.front_default;
                data.stats = response.data.stats;
                data.types = response.data.types;
                dataPokemons.push(data)
            })
    })


    generateCard();
}

/**
 * Metodo que utilizamos para realizar el cambio de pagina
 * @param {*} page le pasamos si es la siguiente o anterior
 */
const changePage = (page) => {
    dataPokemons = [];
    if (page === "previous") {
        getNamePokemon(previousPage);
    } else if (page === "next") {
        getNamePokemon(nextPage);
    }
}

/**
 * Metodo que utilizamos para poner la primera letra mayuscula.
 * @param {*} str le pasamos el nombre del pokemon
 * @returns 
 */
function primeraLetraMayuscula(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Metodo que utilizamos para generar las cartas de los pokemons que cogemos de la api
 * @returns retornamos posibles errores o saber si esta vacio.
 */
const generateCard = () => {
    try {
        console.log(dataPokemons.length);
        if (dataPokemons.length === 0) {

            console.log("No hay datos en dataPokemons");
            setTimeout(generateCard, 1000);
            return;
        }

        const infoPokemonElement = document.getElementById("infoPokemon");
        if (!infoPokemonElement) {
            console.log("El elemento con ID 'infoPokemon' no existe");
            return;
        }

        infoPokemonElement.innerHTML = dataPokemons.map(item => {
            return `
            <button id="${item.id}" class=${checkIsSelected(item.id)} onclick="selectCard(${item.id})">
              <h2 id="name">${primeraLetraMayuscula(item.name)}</h2>
              <div class="body-card">
                <img class="imgPoke" src="${item.image}" alt="Imagen del pokemon" />
                <div>
                  <strong>Stats:</strong>
                  <ul class="stats">
                    <li><i class="fa fa-heart"></i> ${item.stats[0].base_stat}</li>
                    <li><i class="fa fa-hammer"></i> ${item.stats[1].base_stat}</li>
                    <li><i class="fa fa-shield"></i> ${item.stats[2].base_stat}</li>
                    <li><i class="fa fa-star"></i><i class="fa fa-heart"></i> ${item.stats[3].base_stat}</li>
                    <li><i class="fa fa-star"></i><i class="fa fa-hammer"></i> ${item.stats[4].base_stat}</li>
                    <li><i class="fa fa-star"></i><i class="fa fa-shield"></i> ${item.stats[5].base_stat}</li>
                  </ul>
                </div>
                <div>
                  <strong>Types:</strong>
                  <ul class="type">
                    ${item.types.map(type => {
                return `<li><img src="imgs/${type.type.name}.jpg" /></li>`;
            }).join('')}
                  </ul>
                </div>
              </div>
            </button>`;
        }).join('');
    } catch (error) {
        console.log("Error en generateCard:", error);
    }

};

/**
 * Metodo que utilizamos para almacenar la carta seleccionada o para deselecionarla.
 * @param {*} id le pasaamos el id de la carta.
 */
const selectCard = (id) => {

    const isSelected = itemsSelected.find(idSelected => idSelected.id === id);

    if (isSelected) {
        let tempArray = itemsSelected.filter((valor) => valor.id !== id);
        itemsSelected = tempArray;

        document.getElementById(`${id}`).setAttribute("class", "card");

    } else {
        const objSelected = dataPokemons.find(obj => obj.id === id);
        itemsSelected.push(objSelected);
        document.getElementById(`${id}`).setAttribute("class", "selected");
    }


}

/**
 * Lo utilizamos para comprobar si la carta ha sido selecionada, cuando pasamos de pagina o no.
 * @param {*} id lo comprobamos con el ID
 * @returns retornamos si ha sido seleccionada o no.
 */
const checkIsSelected = (id) => {
    const isSelected = itemsSelected.find(idSelected => idSelected.id === id);
    if (isSelected) {
        return "selected";
    } else {
        return "card";
    }
}

/**
 * Metodo que utilizamos para postear la información en la base de datos.
 */
const saveInfoDB = () => {

    if (itemsSelected.length !== 0) {
        let countAdd = 0;
        let countNotAdd = 0;
        itemsSelected.map(item => {

            $.ajax({
                type: "POST", //metodo POST para enviar datos al servidor
                url: "callDBPokemons.php", // ruta del fichero PHP del servidor
                data: {
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    hp: item.stats[0].base_stat,
                    attack: item.stats[1].base_stat,
                    defense: item.stats[2].base_stat,
                    special_attack: item.stats[3].base_stat,
                    special_defense: item.stats[4].base_stat,
                    speed: item.stats[5].base_stat,
                    type_01: item.types[0].type.name,
                    type_02: (item.types.length === 1) ? null : item.types[1].type.name
                },
                success: (response) => { //resultado del PHP del servidor

                    countAdd++;
                    console.log("dentro success: " + (countAdd + countNotAdd));
                    console.log("dentro success: " + itemsSelected.length);
                    if ((countAdd + countNotAdd) === itemsSelected.length) {
                        alert("Petición de post finalizada con " + itemsSelected.length + " pokemons seleccionados.\nPokemons añadidos en la base de datos son: " + countAdd + ".\nPokemons que seleccionados que ya estan dentro de la base de datos: " + countNotAdd);
                    }
                },
                error: (xhr, status, error) => {
                    countNotAdd++;
                    console.log("dentro de error" + (countAdd + countNotAdd));
                    console.log("dentro de error" + itemsSelected.length);
                    if ((countAdd + countNotAdd) === itemsSelected.length) {
                        alert("Petición de post finalizada con " + itemsSelected.length + " pokemons seleccionados.\nPokemons añadidos en la base de datos son: " + countAdd + ".\nPokemons que seleccionados que ya estan dentro de la base de datos: " + countNotAdd);
                    }
                }
            });

        })


    } else {
        alert("No tienes nada seleccionado");
    }
}
let searchInput = document.getElementById("searchInputDB");

/**
 * Metodo que utilizamos para coger la información que tenemos guardada en la base de datos y funcione con el buscador.
 */
const getInfoDB = () => {
    let pokemonName = searchInput.value;

    if (pokemonName !== "") {
        let url = `callDBPokemons.php?name=${pokemonName}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                //console.log(data);
                dataPokemonsDB = data;
                generateDBCard();
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    } else {
        alert("No has escrito nada en el buscador");
    }



}

/**
 * Metodo que utilizamos para generar las cartas de los pokemons que hayamos buscado en nuestra base de datos.
 * @returns retornamos en caso de error que no exista la sección.
 */
const generateDBCard = () => {

    try {

        const infoPokemonDB = document.getElementById("infoPokemonDB");
        if (!infoPokemonDB) {
            console.log("El elemento con ID 'infoPokemon' no existe");
            return;
        }

        infoPokemonDB.innerHTML = dataPokemonsDB.map(item => {
            return `
            <button id="${item.id}_db" class=${checkIsSelected(item.id)} onclick="selectCard(${item.id})">
              <h2 id="name">${primeraLetraMayuscula(item.name)}</h2>
              <div class="body-card">
                <img class="imgPoke" src="${item.image}" alt="Imagen del pokemon" />
                <div>
                  <strong>Stats:</strong>
                  <ul class="stats">
                    <li><i class="fa fa-heart"></i> ${item.stat_hp}</li>
                    <li><i class="fa fa-hammer"></i> ${item.stat_attack}</li>
                    <li><i class="fa fa-shield"></i> ${item.stat_defense}</li>
                    <li><i class="fa fa-star"></i><i class="fa fa-heart"></i> ${item.stat_speed}</li>
                    <li><i class="fa fa-star"></i><i class="fa fa-hammer"></i> ${item.stat_special_attack}</li>
                    <li><i class="fa fa-star"></i><i class="fa fa-shield"></i> ${item.stat_special_defense}</li>
                  </ul>
                </div>
                <div>
                  <strong>Types:</strong>
                  <ul class="type">
                  <li><img src="imgs/${item.type_01}.jpg" /></li>
                    ${item.type_02 != "" ?
                    `<li><img src="imgs/${item.type_02}.jpg" /></li>` : ''}
                  </ul>
                </div>
              </div>
            </button>`;
        }).join('');
    } catch (error) {
        console.log("Error en generateCard:", error);
    }
}

searchInput.addEventListener("focus", function () {
    document.getElementById("sectionBtns").style.display = "none";
    document.getElementById("infoPokemon").style.display = "none";
});

searchInput.addEventListener("blur", function () {

    if (searchInput.value === "") {
        document.getElementById("sectionBtns").style.display = "flex";
        document.getElementById("infoPokemon").style.display = "flex";

        if (dataPokemonsDB.length >= 1) {
            for (let i = 0; i < dataPokemonsDB.length; i++) {
                document.getElementById(`${dataPokemonsDB[i].id}_db`).remove();
            }
        } else {
            document.getElementById(`${dataPokemonsDB[0].id}_db`).remove();
        }
        dataPokemonsDB = [];
    }

});