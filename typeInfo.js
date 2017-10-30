// TODO: Improve this. Pull out the createTypeList() logic. CLEAN THIS UP.
'use strict';
var rp = require('request-promise');
const typeInfo = require('./typeconversion');

class TypeInfo {
  constructor() {}

  async getWeakAndStrength(types) {
    let typelists = []
    let typelistsORI = [] // DO NOT DELETE
    let typeObject = {};

    for (let type of types) {
      const typeInfo = await rp(`http://pokeapi.co/api/v2/type/${type}`, {
        json: true
      });
      const typeList = this.createTypeList(typeInfo);
      const typeListTWO = this.createTypeList(typeInfo); // need a copy
      typelists.push(typeList);
      typelistsORI.push(typeListTWO); // There needs to be two so we don't et confused by pass by reference
    }
    // This logic works but the type lists get fucked up becuase typelists is no longer its original value becuase there is no deep copy
    if (typelists.length === 2) {
      typeObject.to = Object.assign(typelists[0].to, typelists[1].to);
      typeObject.from = Object.assign(typelists[0].from, typelists[1].from); // At this point `typelists` is rubbish now
      Object.keys(typelistsORI[0].to).forEach((type) => {
        if (typelistsORI[1].to[type]) {
          typeObject.to[type] = typelistsORI[1].to[type] * typelistsORI[0].to[type]
        }
      })

      Object.keys(typelistsORI[0].from).forEach((type) => {
        if (typelistsORI[1].from[type]) {
          typeObject.from[type] = typelistsORI[1].from[type] * typelistsORI[0].from[type]
        }
      })
    } else {
      typeObject = typelistsORI[0];
    }
    return this.toTypeString(typeObject);
  }

  createTypeList(type) {
    // These are created corectly
    const damageRelations = type.damage_relations;
    const modifierList = {
      "to": {},
      "from": {}
    };
    damageRelations.half_damage_from.forEach((type) => {
      modifierList.from[type.name] = 0.5;
    })
    damageRelations.no_damage_from.forEach((type) => {
      modifierList.from[type.name] = 0;
    })
    damageRelations.double_damage_from.forEach((type) => {
      modifierList.from[type.name] = 2;
    })
    damageRelations.half_damage_to.forEach((type) => {
      modifierList.to[type.name] = 0.5;
    })
    damageRelations.no_damage_to.forEach((type) => {
      modifierList.to[type.name] = 0;
    })
    damageRelations.double_damage_to.forEach((type) => {
      modifierList.to[type.name] = 2;
    })
    return modifierList;
  }

  toTypeString(typeObject) {
    let response = 'Types defenses \n';
    for (let type in typeObject.from) {
      response += `${type.charAt(0).toUpperCase() + type.slice(1)}: ${typeObject.from[type]}x \n`
    }
    return response;
  }
}

exports.TypeInfo = TypeInfo;
