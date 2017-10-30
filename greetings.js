'use strict';
class Greetings {
  constructor() {}

  static getStarted(payload, chat) {
    const welcome = `Hey there, trainer! I'm your trusty Pokedex. If you've encountered a wild Pokemon or looking for a bit of information enter their name to get started.`;
    const options = { typing: true };
    chat.say(welcome, options);
  }
}
exports.Greetings = Greetings;
