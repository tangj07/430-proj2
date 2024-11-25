import React, { useState, useEffect } from 'react';

const RecipeEdit = ({ recipeId, onRecipeUpdated }) => {
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            const response = await fetch(`/getRecipe/${recipeId}`);
            const data = await response.json();
            setRecipe(data);
        };
        fetchRecipe();
    }, [recipeId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedRecipe = {
            name: formData.get('name'),
            ingredients: formData.get('ingredients').split(','),
            steps: formData.get('steps').split('\n'),
        };

        const response = await fetch(`/updateRecipe/${recipeId}`, {
            method: 'POST',
            body: JSON.stringify(updatedRecipe),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            onRecipeUpdated();
        }
    };

    if (!recipe) return <div>Loading...</div>;

    return (
        <form onSubmit={handleUpdate}>
            <input name="name" defaultValue={recipe.name} />
            <textarea name="ingredients" defaultValue={recipe.ingredients.join(', ')} />
            <textarea name="steps" defaultValue={recipe.steps.join('\n')} />
            <button type="submit">Update Recipe</button>
        </form>
    );
};

export default RecipeEdit;
