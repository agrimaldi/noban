var Schema = require('mongoose').Schema;


var PlayerSchema = new Schema({
    name: {
        first: String
      , last: String
    }
  , login: String
  , email: String
  , lastConnection: Date
  , joined: Date
  , kyulevel: Number
  , danlevel: Number
  , games: [GameSchema]
});


var GameSchema = new Schema({
    title: String
  , date: Date
  , size: Number
  , players: [PlayerSchema]
  , minlevel: {
      kyulevel: Number
    , danlevel: Number
  }
  , maxlevel: {
      kyulevel: Number
    , danlevel: Number
  }
});


exports.PlayerSchema = PlayerSchema;
exports.GameSchema = GameSchema;
