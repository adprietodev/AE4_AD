let namePokemons = [];

let dataPokemons = [];
let itemsSelected = []

let nextPage = "";
let previousPage = "";

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
const getInfoApi = (objPokemon) => {
    let tempArr = objPokemon;

    namePokemons = tempArr.map(item => item.name);
    getInfoPokemon();

}

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

const changePage = (page) => {
    dataPokemons = [];
    if (page === "previous") {
        getNamePokemon(previousPage);
    } else if (page === "next") {
        getNamePokemon(nextPage);
    }
}

function primeraLetraMayuscula(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

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

const checkIsSelected = (id) => {
    const isSelected = itemsSelected.find(idSelected => idSelected.id === id);
    if (isSelected) {
        return "selected";
    } else {
        return "card";
    }
}


const saveInfoDB = () => {


    if (itemsSelected.length !== 0) {
        let count = 0;
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
                    count++;
                    if (count === itemsSelected.length) {
                        alert(response);
                    }
                },
                error: (xhr, status, error) => {
                    count++;
                    alert("El pokemon con la ID -> " + item.id + " ya ha sido insertado anteriormente en la base de datos.");
                }
            });
        })
    } else {
        alert("No tienes nada seleccionado");
    }
}