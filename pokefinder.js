'use strict';
const {
  TypeInfo
} = require('./TypeInfo');
const Pokedex = require('pokedex-promise-v2');

class PokeFinder {
  constructor() {
    // Object to retrieve responses to intents
    this.typeInfo = new TypeInfo();
    this.dex = new Pokedex();
  }

   async findPokemon(payload) {
    let pokemon = {}
    const pokeName = payload.message.text.toLowerCase();
    pokemon.basic = await this.pokemonBaseInfo(pokeName);
    pokemon.description = await this.pokemonDescription(pokemon.basic);

    return pokemon;
  }

  async typingStats(types) { //TODO: Decide which stats to send
    return await this.typeInfo.getWeakAndStrength(types);
  }

  pokemonBaseInfo(pokemon) {
    return this.dex.getPokemonByName(pokemon)
  }

  pokemonDescription(pokemon) {
    return this.dex.getPokemonSpeciesByName(pokemon.species.name)
  }

}
exports.PokeFinder = PokeFinder;
