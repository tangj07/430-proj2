const React = require('react');
const { useState, useEffect } = React;

const RecipeList = (props) => {
    const [recipes, setRecipes] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        const loadRecipesFromServer = async () => {
            const response = await fetch('/getRecipes');
            const data = await response.json();
            setRecipes(data.recipes);
            setCurrentUser(data.currentUser);
            setIsPremium(data.premium);
            console.log(data.premium);
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

    const premiumRecipe = {
        _id: 'hardcoded-premium',
        name: 'Stir-fried tomatoes and eggs',
        premium: true,
        owner: { username: 'Admin' },
        ingredients: ['Tomatoes', 'Eggs', 'Salt', 'Pepper', 'Sesame Oil'],
        steps: [
            'Chop tomatoes.',
            'Crack and whisk eggs.',
            'Mix eggs with salt and pepper.',
            'Add oil to wok and scramble eggs.',
            'Remove eggs and with more oil, add tomatoes.',
            'Stir-fry for a minute then add sugar, salt, water, and the cooked eggs.',
            'Mix everything and then cover wok for 1-2 minutes and uncover while continuing to stir till it thickens.'
        ]
    };

    if (recipes.length === 0) {
        return (
            <div className="recipeList">
                <h3 className="emptyRecipe">No Recipes yet!</h3>
            </div>
        );
    }

    const allRecipes = [premiumRecipe, ...recipes];

    const recipeNodes = allRecipes.map(recipe => {
        if (recipe.premium && !isPremium) {
            return null;
        }
        return (
            <div key={recipe._id} className="recipe-card">
                <h3 className="recipe-name">Recipe: {recipe.name}</h3>
                {recipe.premium && <span className="premium-tag">Premium Recipe</span>}
                <p><strong>Owner:</strong> {recipe.owner?.username || 'Unknown'}</p>
                
                <p className="recipe-ingredients">
                    <strong>Ingredients:</strong>
                    <ol>
                        {recipe.ingredients.map((ingredient, index) => <li key={index}>{ingredient}</li>)}
                    </ol>
                </p>
                
                <p className="recipe-steps">
                    <strong>Steps:</strong>
                    <ol>
                        {recipe.steps.map((step, index) => <li key={index}>{step}</li>)}
                    </ol>
                </p>

                {currentUser === recipe.owner?._id && (
                    <button onClick={() => deleteRecipe(recipe._id)}>Delete</button>
                )}
            </div>
        );
    });

    return (
        <div className="recipe-list">
            {recipeNodes}
        </div>
    );
};

export default RecipeList;
