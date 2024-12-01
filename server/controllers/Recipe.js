const models = require('../models');

const { Recipe } = models;

const recipePage = async (req, res) => res.render('app');

// Create a new recipe
const makeRecipe = async (req, res) => {
  if (!req.body.name || !req.body.ingredients || !req.body.steps) {
    return res.status(400).json({ error: 'Name, ingredients, and steps are required!' });
  }

  const recipeData = {
    name: req.body.name,
    ingredients: req.body.ingredients.split(','), // string into an array
    steps: req.body.steps.split(','),
    owner: req.session.account._id,
  };

  try {
    const newRecipe = new Recipe(recipeData);
    await newRecipe.save(); // Save recipe

    return res.status(201).json({
      name: newRecipe.name,
      ingredients: newRecipe.ingredients,
      steps: newRecipe.steps,
    });
  } catch (err) {
    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({ error: 'Recipe already exists!' });
    }
    return res.status(500).json({ error: 'An error occurred while creating the recipe!' });
  }
};

// Retrieve recipes
const getRecipes = async (req, res) => {
  try {
      const docs = await Recipe.find()
          .populate('owner', 'username')
          .select('name ingredients steps owner')
          .lean()
          .exec();

      return res.json({ recipes: docs, currentUser: req.session.account._id }); 
  } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error retrieving recipes!' });
  }
};

// Find and delete recipe
const deleteRecipe = async (req, res) => {
  try {
      const recipeId = req.params.id;

      const deletedRecipe = await Recipe.findOneAndDelete({
          _id: recipeId,
          owner: req.session.account._id,
      });

      if (!deletedRecipe) {
          return res.status(404).json({ error: 'Recipe not found or not authorized to delete' });
      }

      return res.status(200).json({ message: 'Recipe deleted successfully!' });
  } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'An error occurred while deleting the recipe' });
  }
};

module.exports = {
  recipePage,
  makeRecipe,
  getRecipes,
  deleteRecipe,
};
