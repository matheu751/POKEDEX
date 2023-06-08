// selectors
const ul = document.querySelector('.pokemon-list')

const btnLoadPokemons = document.querySelector('.loader')

const alterTheme = document.querySelector('#alter-theme')

const contentAdd = document.querySelector('.content')

const searchPokemon = document.querySelector('.search-pokemon')

const selectType = document.getElementById('select-type')

const returnBeginPage = document.querySelector('.logo')

// state
const actualTheme = localStorage.getItem('theme')

// on page loading
actualTheme && document.body.classList.add(actualTheme)

// variables
let functionCalled = true

let showPokemonsCalled = true

// functions
const fetchPokemon = async (id) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)

    const data = await APIResponse.json()
    
    return data
}

const renderPokemon = (numStart, numEnd) => {
    pokemonPromises = []
    for (i = numStart; i <= numEnd; i++) {
        pokemonPromises.push(fetchPokemon(i))
    }

    Promise.all(pokemonPromises).then(pokemons => {
        pokemons.forEach(pokemon => {
            const name = pokemon.name[0].toUpperCase() + pokemon.name.substring(1)
            const id = transformTag(pokemon.id)
            const types = pokemon.types.map(infoType => infoType.type.name)
            const typePokemon = formateTypes(types)
            const img = `${pokemon['sprites']['versions']['generation-v']
            ['black-white']['animated']['front_default']}`
            
            ul.appendChild(createStructure(name, id, pokemon.id, types, typePokemon, img))
            changeBtn()
        })
    })    
}

renderPokemon(1, 640)

const createStructure = (name, pokemonTag, id, types, typeFormated, imgPath) => {
    const li = document.createElement("li")
    const div = document.createElement("div")
    div.insertAdjacentHTML('beforeend', `
        <span class="pokemon-name"> ${name} </span>
        <span class="pokemon-tag"> #${pokemonTag} </span>`)

    const img = document.createElement("img")
    const ul = document.createElement("ul")

    li.className = "card-pokemon"
    div.className = "informations"
    img.className = "image"
    ul.className = "type"
   
    li.setAttribute("onclick", `getCard(${id})`)
    li.setAttribute("style", `border-top: solid 10px var(--${types})`)
    img.setAttribute("alt", `${name}`)
    img.setAttribute("src", `${imgPath}`)

    ul.insertAdjacentHTML('beforeend', typeFormated)
    li.appendChild(div)
    li.appendChild(img)
    li.appendChild(ul)
    return li
}   

const modalSwitch = () => {
    const modal = document.querySelector('.modal')
    const actualStyle = modal.style.display
    
    if (actualStyle == 'block') {
        modal.style.display = 'none'
    }
    else {
        modal.style.display = 'block'
    }
}

const transformTag = (tag) => {
    lengthTag = String(tag).length
    let finalTag = 0
    if(lengthTag == 1) {
        finalTag = '00' + tag
    }
    else if(lengthTag == 2) {
        finalTag = '0' + tag
    }
    else {
        finalTag = tag
    }
    return finalTag
}

const formateTypes = (array) => {
    let accumulate = ''
    for (let value of array) {
        accumulate += `<li class="${value}-type" style="background: var(--${value})"> ${value.toUpperCase()}`
    }
    return accumulate
}

const getCard = async (id) => {
    const pokemon = await fetchPokemon(id)
    const tag = transformTag(pokemon.id)
    const name = pokemon.name[0].toUpperCase() + pokemon.name.substring(1)
    const types = formateTypes(pokemon.types.map(infoType => infoType.type.name))

    contentAdd.style.background = `linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, 
        rgba(0, 0, 0, 0.1) 100%), 
        var(--${pokemon['types']['0']['type']['name']}`
    
    contentAdd.innerHTML = `
        <div class="image-container"> 
            <img class="image" alt="${name}"
            src="https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${tag}.png">
            <img class="pokeball-back" src="./src/images/pokeball.png">
        </div>        
        <div class="informations"> 
            <span class="pokemon-name"> ${name}</span>
            <span class="pokemon-tag"> #${tag} </span>
        </div>
        <ul class="type-details">
            ${types}
        </ul>
        <div class="stats"> 
            <div class="title-abilities"> Abilities </div>
            <ul class="moves">
                <li class="first-move"> ${pokemon['moves']['0']['move']['name']}</li>
                <li class="second-move">  ${pokemon['moves']['2']['move']['name']}</li>
            </ul>
            <div class="title-weight"> Weight </div>
            <div class="pokemon-weight"> ${pokemon.weight} </div>
            <div class="title-height"> Height </div>
            <div class="pokemon-height"> ${pokemon.height} </div>
            <div class="title-speed"> Speed </div>
            <div class="pokemon-speed"> ${pokemon['stats']['5']['base_stat']} </div>
        </div>
        `
    modalSwitch()
}

const getPokemons = () => {
    const pokemonList = document.querySelectorAll('.card-pokemon')
    return pokemonList
}

const changeBtn = () => {
    if(functionCalled) {
        btnLoadPokemons.classList.remove('loader')
        btnLoadPokemons.classList.toggle('show-more')
        btnLoadPokemons.textContent = 'SHOW MORE'
    }
    functionCalled = false  
}

selectPokemonsType = () => {
    const value = selectType.options[selectType.selectedIndex].value
        if(value != '') {
            for (let pokemon of getPokemons()) {
                let type = pokemon.querySelector('.type')
                let liTypes = type.querySelectorAll('li')
                let types = ''
                for (let item of liTypes) {
                    types += item.className
                }
                types.includes(value) 
                ?pokemon.style.display = "flex"
                :pokemon.style.display = "none"
            }
        }   
        else {
            for (let pokemon of getPokemons()) {
                pokemon.style.display = "flex"
            }
        }
}

filterPokemons = () => {
    if(searchPokemon.value != '') {
        selectType.selectedIndex = 0
        for (let pokemon of getPokemons()) {
            let name = pokemon.querySelector('.pokemon-name').textContent.toLowerCase()
            let tag = pokemon.querySelector('.pokemon-tag').textContent
            let text = searchPokemon.value.toLowerCase()

            name.includes(text) || tag.includes(text)
            ? pokemon.style.display = "flex"
            : pokemon.style.display = "none"
        }
    } 
    else {
        for (let pokemon of getPokemons()) {
            pokemon.style.display = "flex"
        }
    }
}

showMorePokemons = () => {
    if (showPokemonsCalled) {
        getPokemons().forEach(pokemon => {
            pokemon.style.display = 'flex'
        })
        document.querySelector('.show-more').remove()
    }
    showPokemonsCalled = false
}

changeTheme = () => {
    document.body.classList.toggle('dark-mode')
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark-mode')
            alterTheme.innerHTML = '<iconify-icon icon="ph:moon" width="35" height="35"></iconify-icon>'
        } 
        else {
            localStorage.removeItem('theme')
            alterTheme.innerHTML = '<iconify-icon icon="ri:sun-line" width="35" height="36"> </iconify-icon>'
        }
}

returnTopPage = () => {
    window.scrollTo(0, 0)
}

// events
alterTheme.addEventListener('click', changeTheme)

searchPokemon.addEventListener('click', showMorePokemons)

searchPokemon.addEventListener('input', filterPokemons)

selectType.addEventListener('click', showMorePokemons)

selectType.addEventListener('input', selectPokemonsType)

returnBeginPage.addEventListener('click', returnTopPage)

window.onclick = (event) => {
    const modal = document.querySelector('.modal')
    if (event.target == modal) {
        modalSwitch()
    }
}