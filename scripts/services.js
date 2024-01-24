let namePokemons = [];

let dataPokemons = [];

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
            types: []
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
            <button id="${item.id}" class="card">
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




// const saveInfoDB = () => {

//     console.log(infoPokemon);

//     $.ajax({
//         type: "POST", //metodo POST para enviar datos al servidor
//         url: "callDBPokemons.php", // ruta del fichero PHP del servidor
//         data: {
//             id: infoPokemon.id,
//             name: infoPokemon.name,
//             image: infoPokemon.image
//         },
//         success: (response) => { //resultado del PHP del servidor
//             alert(response);
//         },
//         error: (xhr, status, error) => {
//             alert("Error - " + xhr.responseText);
//         }
//     });
// }