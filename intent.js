module.exports = (payload, name) => {
  return payload.message.nlp.entities[name] && payload.message.nlp.entities[name][0].confidence >= 0.8;
}
