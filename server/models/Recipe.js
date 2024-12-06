const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  steps: {
    type: [String],
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  premium: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Recipe', RecipeSchema);
