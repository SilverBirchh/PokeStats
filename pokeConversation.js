'use strict';
const {
  PokeFinder
} = require('./PokeFinder');

class PokeConversation {
  constructor() {
    // Used to find information about a pokemon
    this.pokeFinder = new PokeFinder()

    // Callbacks used for conversation
    this.callbacks = [{
        pattern: ['weakness', 'strength', 'weakness and strength'],
        callback: (payload, convo) => this.typeIntent(payload, convo)
      },
      {
        pattern: ['no'],
        callback: (payload, convo) => this.endConversion(payload, convo)
      },
      {
        pattern: ['stats'],
        callback: (payload, convo) => this.statsIntent(payload, convo)
      },
      {
        pattern: ['ability'],
        callback: (payload, convo) => this.abilityIntent(payload, convo)
      },
    ];
  }

  // Entry point for discussion of a Pokemon.
  startConversation(payload, chat) {
    chat.conversation((convo) => this.findPokemon(payload, convo))
  }

 async findPokemon(payload, convo){
    try {
      const pokemon = await this.pokeFinder.findPokemon(payload);
      this.sendPokemon(pokemon.basic, pokemon.description, convo);
    } catch (err) {
      convo.say("Something has gone wrong. Please try again");
      console.log(err)
    }
  }

  sendPokemon(pokemon, description, convo) {
    const types = pokemon.types.map(type => type.type.name);
    const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const enDexEntry = description.flavor_text_entries.filter(entry => entry.language.name === 'en');

    convo.set('pokemon', pokemon);
    convo.set('name', name);
    convo.set('types', types);

    convo.sendGenericTemplate([{
      title: name,
      subtitle: `Pokedex #: ${pokemon.id}. Type: ${types.join(' and ')}. Height: ${pokemon.height/10}m. Weight: ${pokemon.weight/10}kg.`,
      image_url: `${pokemon.sprites.front_default}`
    }]).then(() => {
      convo.say(`${enDexEntry[0].flavor_text.replace(/(\r\n|\n|\r)/gm," ")}`)
    }).then(() => {
      this.askIntent(convo);
    })
  }

  askIntent(convo) {
    convo.ask(`Would you like anymore information on ${convo.get('name')}?`, (payload, convo) => {
      this.intent(payload, convo)
    }, this.callbacks);
  }

  intent(payload, convo) {
    // TODO: Incase no callback avaliable. Show Conversation help and then ask intent again.
  }

  sendIntent(message, convo) {
    convo.say(message)
      .then(() => this.askIntent(convo))
  }

  endConversion(payload, convo) {
    convo.say('I\'m glad I could be of assistance.')
    convo.end();
  }

  async typeIntent(payload, convo) {
    const types = await this.pokeFinder.typingStats(convo.get('types'))
    this.sendIntent(types, convo);
  }

  async statsIntent(payload, convo) {
    const stats = await this.pokeFinder.pokemonBaseStats(convo.get('name'))
    this.sendIntent(stats, convo);
  }

  async abilityIntent(payload, convo) {
    const ability = await this.pokeFinder.pokemonAbility(convo.get('name'))
    this.sendIntent(stats, convo);
  }
}
exports.PokeConversation = PokeConversation;
