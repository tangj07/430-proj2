const React = require('react');
const helper = require('./helper.js');

const handleRecipe = (e, onRecipeAdded) => {
    e.preventDefault();
    helper.hideError();

    const formData = new FormData(e.target);
    const name = formData.get('name');
    const ingredients = formData.get('ingredients');
    const steps = formData.get('steps');

    if (!name || !ingredients || !steps) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { name, ingredients, steps }, onRecipeAdded);
    return false;
};

const RecipeForm = (props) => {
    return (
        <form id="recipeForm"
            onSubmit={(e) => handleRecipe(e, props.triggerReload)}
            name="recipeForm"
            action="/makeRecipe"
            method="POST"
            className="recipeForm"
        >
            <label htmlFor="name">Recipe Name: </label>
            <input id="recipeName" type="text" name="name" placeholder="Recipe Name" />

            <label htmlFor="ingredients">Ingredients (comma-separated): </label>
            <textarea id="recipeIngredients" name="ingredients" placeholder="e.g., flour, sugar, eggs" rows="3"></textarea>

            <label htmlFor="steps">Steps (comma-separated): </label>
            <textarea id="recipeSteps" name="steps" placeholder="e.g., Mix ingredients, Bake for 20 minutes" rows="5"></textarea>

            <input className="makeRecipeSubmit" type="submit" value="Add Recipe" />
        </form>
    );
};

export default RecipeForm;
