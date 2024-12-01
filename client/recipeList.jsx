const React = require('react');
const { useState, useEffect } = React;

const RecipeList = (props) => {
    const [recipes, setRecipes] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const loadRecipesFromServer = async () => {
            const response = await fetch('/getRecipes');
            const data = await response.json();
            setRecipes(data.recipes);
            setCurrentUser(data.currentUser);
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

    const recipeNodes = recipes.map(recipe => (
        <div key={recipe._id} className="recipe">
            <h3 className="recipeName">Recipe: {recipe.name}</h3>
            <p><strong>Owner:</strong> {recipe.owner?.username || 'Unknown'}</p> 
            <p className="recipeIngredients">
                <strong>Ingredients:</strong>
                <ol>
                    {recipe.ingredients.map((ingredient, index) => <li key={index}>{ingredient}</li>)}
                </ol>
            </p>
            <p className="recipeSteps">
                <strong>Steps:</strong>
                <ol>
                    {recipe.steps.map((step, index) => <li key={index}>{step}</li>)}
                </ol>
            </p>
            {currentUser === recipe.owner?._id && ( <button onClick={() => deleteRecipe(recipe._id)}>Delete</button> )}
        </div>
    ));

    return (
        <div className="recipeList">
            {recipeNodes}
        </div>
    );
};

export default RecipeList;
