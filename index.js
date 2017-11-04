'use strict';
const BootBot = require('bootbot');
const config = require('config');
const {
  Greetings
} = require('./Greetings');
const {
  PokeConversation
} = require('./PokeConversation');
const pokemon = require('./pokemon');
const intent = require('./intent');

// Set up bot configuration
const bot = new BootBot({
  accessToken: config.get('accessToken'),
  verifyToken: config.get('verifyToken'),
  appSecret: config.get('appSecret')
});

const pokeConversation = new PokeConversation();

// Set up listeners
bot.setGetStartedButton((payload, chat) => {
  Greetings.getStarted(payload, chat)
});

bot.on('message', (payload, chat) => {
  if (intent(payload, 'greetings')) {
    Greetings.getStarted(payload, chat)
  } else if (pokemon.includes(payload.message.text.charAt(0).toUpperCase() + payload.message.text.slice(1))) {
    pokeConversation.startConversation(payload, chat)
  } else {
    chat.say('I\'m sorry I did not understand your request :(.') // TODO: Add help response
  }
});

// Start the bot
bot.start(config.get('botPort'));
