
// const alertBtn = () => {
//     alert("Botón pulsado");
// }

let infoPokemon = {
    id: 0,
    name: "",
    image: "",
}

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
            abilities: [],
            stats: [],
            types: []
        }
        axios
            .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then(response => {
                data.id = parseInt(response.data.id);
                data.name = name;
                data.image = response.data.sprites.other.dream_world.front_default;
                data.abilities = response.data.abilities;
                data.stats = response.data.stats;
                data.types = response.data.types;
                dataPokemons.push(data)
            })
    })
    console.log(dataPokemons);
}

const changePage = (page) => {
    dataPokemons = [];
    if (page === "previous") {
        console.log(previousPage);
        getNamePokemon(previousPage);
    } else if (page === "next") {
        getNamePokemon(nextPage);
    }
}

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