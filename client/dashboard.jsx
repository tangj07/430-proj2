const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
import AccountDetails from './accountDetails.jsx';

const handleRecipe = (e, onRecipeAdded) => {
    e.preventDefault();
    helper.hideError();

    const formData = new FormData(e.target);
    const name = formData.get('name');
    const ingredients = formData.get('ingredients');
    const steps = formData.get('steps');

    console.log('Form Data:', { name, ingredients, steps });

    if (!name || !ingredients || !steps) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { name, ingredients, steps }, onRecipeAdded);
    return false;
};

// add recipe
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

            <label htmlFor="steps">Steps (one step per line): </label>
            <textarea id="recipeSteps" name="steps" placeholder="e.g., Mix ingredients\nBake for 20 minutes" rows="5"></textarea>

            <input className="makeRecipeSubmit" type="submit" value="Add Recipe" />
        </form>
    );
};

// list display
const RecipeList = (props) => {
    const [recipes, setRecipes] = useState(props.recipes);

    useEffect(() => {
        const loadRecipesFromServer = async () => {
            const response = await fetch('/getRecipes');
            const data = await response.json();
            setRecipes(data.recipes);
        };
        loadRecipesFromServer();
    }, [props.reloadRecipes]);

    const deleteRecipe = async (id) => {
        try {
            const response = await fetch(`/deleteRecipe/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setRecipes(recipes.filter(recipe => recipe._id !== id));
            } else {
                console.error('Failed to delete Recipe');
            }
        } catch (error) {
            console.error('Error deleting Recipe:', error);
        }
    };

    if (recipes.length === 0) {
        return (
            <div className="recipeList">
                <h3 className="emptyRecipe">No Recipes yet!</h3>
            </div>
        );
    }

    const recipeNodes = recipes.map(recipe => {
        return (
            <div key={recipe._id} className="recipe">
                <h3 className="recipeName">Recipe: {recipe.name}</h3>
                <p className="recipeIngredients">
                    <strong>Ingredients:</strong> 
                    <ol>
                        {recipe.ingredients.map((ingredients, index) => <li key={index}>{ingredients}</li>)}
                    </ol>
                </p>
                <p className="recipeSteps">
                    <strong>Steps:</strong>
                    <ol>
                        {recipe.steps.map((step, index) => <li key={index}>{step}</li>)}
                    </ol>
                </p>
                <button onClick={() => deleteRecipe(recipe._id)}>Delete</button>
            </div>
        );
    });

    return (
        <div className="recipeList">
            {recipeNodes}
        </div>
    );
};

const App = () => {
    const [reloadRecipes, setReloadRecipes] = useState(false);
    const [showAccountDetails, setShowAccountDetails] = useState(false);
  
    return (
      <div>
        <button onClick={() => setShowAccountDetails(!showAccountDetails)}>
          {showAccountDetails ? 'Hide Account Details' : 'Show Account Details'}
        </button>
  
        {showAccountDetails ? (
          <div id="accountDetails">
            <AccountDetails />
          </div>
        ) : (
          <div id="makeRecipe">
            <RecipeForm triggerReload={() => setReloadRecipes(!reloadRecipes)} />
          </div>
        )}
  
        <div id="recipes">
          <RecipeList recipes={[]} reloadRecipes={reloadRecipes} />
        </div>
      </div>
    );
  };
  

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};
window.onload = init;