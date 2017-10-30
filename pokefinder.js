'use strict';
var rp = require('request-promise');
const {
  TypeInfo
} = require('./TypeInfo');

class PokeFinder {
  constructor() {
    // Object to retrieve responses to intents
    this.typeInfo = new TypeInfo();
  }

   async findPokemon(payload) {
    let pokemon = {}
    const pokeName = payload.message.text.toLowerCase();
    pokemon.basic = await this.pokemonBaseInfo(pokeName);
    pokemon.description = await this.pokemonDescription(pokemon.basic);

    return pokemon;
  }

  async typingStats(types) {
    return await this.typeInfo.getWeakAndStrength(types);
  }

  pokemonBaseInfo(pokemon) {
    return rp(`http://pokeapi.co/api/v2/pokemon/${pokemon}`, {
      json: true
    });
  }

  pokemonDescription(pokemon) {
    return rp(pokemon.species.url, {
      json: true
    });
  }

}
exports.PokeFinder = PokeFinder;
