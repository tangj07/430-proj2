import React, { useState, useEffect } from 'react';

const RecipeSearch = ({ onSearchResults }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]); 

    useEffect(() => {
        // Fetch recipes
        const fetchRecipes = async () => {
            try {
                const response = await fetch('/getRecipes');
                const data = await response.json();
                console.log('Fetched Recipes:', data);
                if (data && Array.isArray(data.recipes)) {
                    setRecipes(data.recipes);  
                    setFilteredRecipes(data.recipes);  
                } else {
                    console.error('Error: data.recipes is not an array or is undefined');
                    setRecipes([]);  
                    setFilteredRecipes([]); 
                }
            } catch (error) {
                console.error('Error fetching recipes:', error);
                setRecipes([]);  
                setFilteredRecipes([]); 
            }
        };
        fetchRecipes();
    }, []); 

    const handleSearch = (event) => {
        event.preventDefault();
        setSubmitted(true);
        const filtered = recipes.filter((recipe) =>
            recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        console.log('Filtered Recipes:', filtered);
        setFilteredRecipes(filtered); 
        onSearchResults(filtered);  
    };

    return (
        <div className="recipe-search">
            <h2>Search Recipes</h2>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by recipe name"
                    className="search-input"
                />
                <button type="submit" className="btn btn-search">Search</button>
            </form>
            <div className="search-results">
                {submitted && filteredRecipes.length === 0 ? (
                    <p>No recipes found.</p>
                ) : (
                    submitted &&
                    filteredRecipes.map((recipe, index) => (
                        <div key={index} className="recipe-card">
                            <h3 className="recipe-name">{recipe.name}</h3>
                            <p className="recipe-ingredients">
                                <strong>Ingredients:</strong>
                                <ol>
                                    {recipe.ingredients.map((ingredient, index) => (
                                        <li key={index}>{ingredient}</li>
                                    ))}
                                </ol>
                            </p>
                            <p className="recipe-steps">
                                <strong>Steps:</strong>
                                <ol>
                                    {recipe.steps.map((step, index) => (
                                        <li key={index}>{step}</li>
                                    ))}
                                </ol>
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );    
};

export default RecipeSearch;
