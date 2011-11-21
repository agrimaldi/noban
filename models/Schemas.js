var Schema = require('mongoose').Schema
  , ObjectId = Schema.ObjectId;


var PlayerSchema = new Schema({
    name: {
      first: String
    , last: String
    }
  , login: String
  , email: String
  , lastConnection: Date
  , joined: Date
  , level: {
      kyu: Number
    , dan: Number
    }
  , games: {
      won: [{ type: ObjectId, ref: 'GameSchema' }]
    , lost: [{ type: ObjectId, ref: 'GameSchema' }]
    , tie: [{ type: ObjectId, ref: 'GameSchema' }]
    , current: [{ type: ObjectId, ref: 'GameSchema' }]
    }
});


var GameSchema = new Schema({
    title: String
  , date: Date
  , size: Number
  , creator: { type: ObjectId, ref: 'PlayerSchema' }
  , players: {
      black: { type: ObjectId, ref: 'PlayerSchema' }
    , white: { type: ObjectId, ref: 'PlayerSchema' }
    , watchers: [{ type: ObjectId, ref: 'PlayerSchema' }]
    }
  , winner: { type: ObjectId, ref: 'PlayerSchema' }
  , loser: { type: ObjectId, ref: 'PlayerSchema' }
  , level: {
      min: {
        kyu: Number
      , dan: Number
      }
    , max: {
        kyu: Number
      , dan: Number
      }
    }
});


exports.PlayerSchema = PlayerSchema;
exports.GameSchema = GameSchema;
