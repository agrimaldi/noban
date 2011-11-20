/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , PlayerSchema = require('./players').PlayerSchema;


/**
 * Schema definition
 */

var GameSchema = new Schema({
    title: String
  , date: Date
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


/**
 * Pre hook.
 */

//BlogPost.pre('save', function(next, done){
  //emailAuthor(done); // some async function
  //next();
//});


/**
 * Methods
 */

GameSchema.statics.findByTitle = function (title, callback) {
  return this.find({ title: title }, callback);
}


/**
 * Define model.
 */

mongoose.model('Game', GameSchema);
exports.GameSchema = GameSchema;
